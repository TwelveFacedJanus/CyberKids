# app/routers/groups.py
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from ..database import groups as groups_col, users as users_col, tasks as tasks_col
from ..dependencies import require_admin
from ..models import Group, User
from ..schemas import GroupCreate, GroupOut, GroupUpdate

router = APIRouter(prefix="/api/groups", tags=["groups"])


@router.get("", response_model=List[GroupOut])
async def list_groups(_: User = Depends(require_admin)):
    """Получить список всех групп"""
    docs = await groups_col.find().sort("name", 1).to_list(1000)
    result = []
    for doc in docs:
        group = Group(**doc)
        user_count = len(group.user_ids)
        result.append(GroupOut(
            **group.model_dump(),
            user_count=user_count
        ))
    return result


@router.post("", response_model=GroupOut)
async def create_group(body: GroupCreate, admin: User = Depends(require_admin)):
    """Создать новую группу"""
    # Проверяем, что группа с таким именем не существует
    existing = await groups_col.find_one({"name": body.name})
    if existing:
        raise HTTPException(status_code=400, detail="Группа с таким именем уже существует")
    
    # Проверяем, что все пользователи существуют
    for user_id in body.user_ids:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail=f"Неверный ID пользователя: {user_id}")
        user = await users_col.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail=f"Пользователь {user_id} не найден")
    
    group = Group(
        name=body.name,
        description=body.description,
        user_ids=body.user_ids,
        created_by=str(admin.id)
    )
    inserted = await groups_col.insert_one(group.model_dump(exclude={"id"}))
    group.id = str(inserted.inserted_id)
    
    # Обновляем пользователей: добавляем им ID группы
    for user_id in body.user_ids:
        await users_col.update_one(
            {"_id": ObjectId(user_id)},
            {"$addToSet": {"groups": str(group.id)}}
        )
    
    return GroupOut(
        **group.model_dump(),
        user_count=len(group.user_ids)
    )


@router.get("/{group_id}", response_model=GroupOut)
async def get_group(group_id: str, _: User = Depends(require_admin)):
    """Получить информацию о группе"""
    if not ObjectId.is_valid(group_id):
        raise HTTPException(status_code=404, detail="Группа не найдена")
    
    doc = await groups_col.find_one({"_id": ObjectId(group_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Группа не найдена")
    
    group = Group(**doc)
    return GroupOut(
        **group.model_dump(),
        user_count=len(group.user_ids)
    )


@router.put("/{group_id}", response_model=GroupOut)
async def update_group(
    group_id: str,
    body: GroupUpdate,
    _: User = Depends(require_admin)
):
    """Обновить группу"""
    if not ObjectId.is_valid(group_id):
        raise HTTPException(status_code=404, detail="Группа не найдена")
    
    update_data = {}
    if body.name is not None:
        update_data["name"] = body.name
    if body.description is not None:
        update_data["description"] = body.description
    
    # Обновляем состав группы
    if body.user_ids is not None:
        # Проверяем, что все пользователи существуют
        for user_id in body.user_ids:
            if not ObjectId.is_valid(user_id):
                raise HTTPException(status_code=400, detail=f"Неверный ID пользователя: {user_id}")
            user = await users_col.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=404, detail=f"Пользователь {user_id} не найден")
        
        # Получаем старый список пользователей
        old_doc = await groups_col.find_one({"_id": ObjectId(group_id)})
        old_group = Group(**old_doc) if old_doc else None
        old_user_ids = old_group.user_ids if old_group else []
        
        # Удаляем группу у пользователей, которых больше нет в группе
        removed_users = set(old_user_ids) - set(body.user_ids)
        for user_id in removed_users:
            await users_col.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"groups": group_id}}
            )
        
        # Добавляем группу новым пользователям
        added_users = set(body.user_ids) - set(old_user_ids)
        for user_id in added_users:
            await users_col.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"groups": group_id}}
            )
        
        update_data["user_ids"] = body.user_ids
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Нет данных для обновления")
    
    await groups_col.update_one(
        {"_id": ObjectId(group_id)},
        {"$set": update_data}
    )
    
    doc = await groups_col.find_one({"_id": ObjectId(group_id)})
    group = Group(**doc)
    
    return GroupOut(
        **group.model_dump(),
        user_count=len(group.user_ids)
    )


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(group_id: str, _: User = Depends(require_admin)):
    """Удалить группу"""
    if not ObjectId.is_valid(group_id):
        raise HTTPException(status_code=404, detail="Группа не найдена")
    
    # Проверяем, существует ли группа
    doc = await groups_col.find_one({"_id": ObjectId(group_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Группа не найдена")
    
    group = Group(**doc)
    
    # Удаляем группу у всех пользователей
    for user_id in group.user_ids:
        await users_col.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"groups": group_id}}
        )
    
    # ✅ Исправлено: forbidden_groups вместо allowed_groups
    await tasks_col.update_many(
        {"forbidden_groups": group_id},
        {"$pull": {"forbidden_groups": group_id}}
    )
    
    # Удаляем саму группу
    await groups_col.delete_one({"_id": ObjectId(group_id)})