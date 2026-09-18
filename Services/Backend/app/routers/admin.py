from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
import constants
from database import results as results_col
from database import tasks as tasks_col
from database import users as users_col
from database import groups as groups_col
from database import quests as quests_col
from dependencies import require_admin, require_full
from models import Result, Task, User, Group
from schemas import (
    ResetPassword,
    ResultDetailedOut,
    StatsOut,
    TopicStat,
    UserCreate,
    UserOut,
    UserUpdate,
    TaskOut,
)
from security import hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ================= Просмотр (роль admin) =================

@router.get("/users", response_model=list[UserOut])
async def list_users(_: User = Depends(require_admin)):
    docs = await users_col.find().sort("created_at", -1).to_list(1000)
    return [UserOut(**User(**d).model_dump()) for d in docs]


@router.get("/results", response_model=list[ResultDetailedOut])
async def list_results(_: User = Depends(require_admin)):
    docs = await results_col.find().sort("completed_at", -1).limit(1000).to_list(1000)
    out: list[ResultDetailedOut] = []
    for d in docs:
        r = Result(**d)
        u = await users_col.find_one({"_id": ObjectId(r.user_id)}) if ObjectId.is_valid(r.user_id) else None
        out.append(
            ResultDetailedOut(
                **r.model_dump(),
                username=u.get("username", "") if u else "",
                full_name=u.get("full_name", "") if u else "",
            )
        )
    return out


@router.get("/stats", response_model=StatsOut)
async def get_stats(_: User = Depends(require_admin)):
    total_users = await users_col.count_documents({})
    all_results = await results_col.find().to_list(10000)

    total_attempts = len(all_results)
    task_ids = {r.get("task_id") for r in all_results}
    total_completed_tasks = len(task_ids)
    avg_pct = (
        round(sum(r.get("score", 0) / max(r.get("max_score", 1), 1) * 100 for r in all_results) / total_attempts)
        if total_attempts
        else 0
    )

    users_docs = await users_col.find({}, {"age_group": 1}).to_list(10000)
    by_age_group: dict[str, int] = {}
    for u in users_docs:
        g = u.get("age_group", "junior")
        by_age_group[g] = by_age_group.get(g, 0) + 1

    by_topic_map: dict[str, dict] = {}
    for r in all_results:
        t = r.get("topic", "?")
        s = by_topic_map.setdefault(t, {"attempts": 0, "score_pct": 0, "best": 0})
        pct = r.get("score", 0) / max(r.get("max_score", 1), 1) * 100
        s["attempts"] += 1
        s["score_pct"] += pct
        s["best"] = max(s["best"], pct)

    by_topic = [
        TopicStat(
            topic=t,
            attempts=v["attempts"],
            avg_score_percent=round(v["score_pct"] / v["attempts"]),
            best_score_percent=round(v["best"]),
        )
        for t, v in by_topic_map.items()
    ]
    by_topic.sort(key=lambda x: -x.attempts)

    # самые сложные задания
    task_stats: dict[str, dict] = {}
    for r in all_results:
        s = task_stats.setdefault(r.get("task_id"), {"attempts": 0, "pct": 0, "title": r.get("task_title", "")})
        s["attempts"] += 1
        s["pct"] += r.get("score", 0) / max(r.get("max_score", 1), 1) * 100
    hardest = sorted(
        [
            {"task_id": k, "title": v["title"], "attempts": v["attempts"],
             "avg_score_percent": round(v["pct"] / v["attempts"])}
            for k, v in task_stats.items()
            if v["attempts"] > 0
        ],
        key=lambda x: x["avg_score_percent"],
    )[:5]

    return StatsOut(
        total_users=total_users,
        total_attempts=total_attempts,
        total_completed_tasks=total_completed_tasks,
        avg_score_percent=avg_pct,
        by_age_group=by_age_group,
        by_topic=by_topic,
        hardest_tasks=hardest,
    )


# ================= Управление (роли admin + full) =================

@router.post("/users", response_model=UserOut)
async def create_user(body: UserCreate, _: User = Depends(require_full)):
    if await users_col.find_one({"username": body.username}):
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")
    if body.age_group not in constants.AGE_GROUPS:
        raise HTTPException(status_code=400, detail="Неверная возрастная группа")

    user = User(
        username=body.username,
        full_name=body.full_name,
        age_group=body.age_group,
        roles=body.roles,
        groups=body.groups or [],
        password_hash=hash_password(body.password),
    )
    inserted = await users_col.insert_one(user.model_dump(exclude={"id"}))
    user.id = str(inserted.inserted_id)
    return UserOut(**user.model_dump())


@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(user_id: str, body: UserUpdate, _: User = Depends(require_full)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    update: dict = {}
    if body.full_name is not None:
        update["full_name"] = body.full_name
    if body.age_group is not None:
        if body.age_group not in constants.AGE_GROUPS:
            raise HTTPException(status_code=400, detail="Неверная возрастная группа")
        update["age_group"] = body.age_group
    if body.password is not None:
        update["password_hash"] = hash_password(body.password)
    if body.roles is not None:
        update["roles"] = body.roles
    if body.is_active is not None:
        update["is_active"] = body.is_active
    if body.groups is not None:
        update["groups"] = body.groups

    if not update:
        raise HTTPException(status_code=400, detail="Нет данных для обновления")

    await users_col.update_one({"_id": ObjectId(user_id)}, {"$set": update})
    doc = await users_col.find_one({"_id": ObjectId(user_id)})
    return UserOut(**User(**doc).model_dump())


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str, admin: User = Depends(require_full)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if str(admin.id) == user_id:
        raise HTTPException(status_code=400, detail="Нельзя удалить самого себя")
    await users_col.delete_one({"_id": ObjectId(user_id)})
    await results_col.delete_many({"user_id": user_id})


@router.post("/users/{user_id}/reset-password", response_model=UserOut)
async def reset_password(user_id: str, body: ResetPassword, _: User = Depends(require_full)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if not body.new_password:
        raise HTTPException(status_code=400, detail="Пароль не может быть пустым")
    await users_col.update_one({"_id": ObjectId(user_id)}, {"$set": {"password_hash": hash_password(body.new_password)}})
    doc = await users_col.find_one({"_id": ObjectId(user_id)})
    return UserOut(**User(**doc).model_dump())

@router.put("/tasks/{task_id}/groups", response_model=TaskOut)
async def update_task_forbidden_groups(
    task_id: str,
    body: dict,  # {"forbidden_groups": ["group_id_1", "group_id_2"]}
    _: User = Depends(require_full)
):
    """Обновить список групп, для которых задание запрещено"""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=404, detail="Задание не найдено")
    
    forbidden_groups = body.get("forbidden_groups", [])
    
    # Проверяем, что группы существуют
    for group_id in forbidden_groups:
        if not ObjectId.is_valid(group_id):
            raise HTTPException(status_code=400, detail=f"Неверный ID группы: {group_id}")
        group = await groups_col.find_one({"_id": ObjectId(group_id)})
        if not group:
            raise HTTPException(status_code=404, detail=f"Группа {group_id} не найдена")
    
    await tasks_col.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"forbidden_groups": forbidden_groups}}
    )
    
    doc = await tasks_col.find_one({"_id": ObjectId(task_id)})
    return TaskOut(**Task(**doc).model_dump())

@router.patch("/tasks/{task_id}/toggle", response_model=TaskOut)
async def toggle_task_enabled(
    task_id: str,
    _: User = Depends(require_full)
):
    """Включить/выключить задание"""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=404, detail="Задание не найдено")
    
    doc = await tasks_col.find_one({"_id": ObjectId(task_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Задание не найдено")
    
    # 🆕 Инвертируем is_enabled
    current = doc.get("is_enabled", True)
    new_value = not current
    
    await tasks_col.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"is_enabled": new_value}}
    )
    
    doc = await tasks_col.find_one({"_id": ObjectId(task_id)})
    return TaskOut(**Task(**doc).model_dump())

@router.get("/quests/stats")
async def get_quest_stats(_: User = Depends(require_admin)):
    pipeline = [
        {"$group": {
            "_id": "$quest_id",
            "total_completed": {"$sum": 1},
            "avg_score": {"$avg": "$score"},
        }}
    ]
    docs = await quests_col.aggregate(pipeline).to_list(100)
    return [
        {
            "quest_id": d["_id"],
            "total_completed": d["total_completed"],
            "avg_score": round(d["avg_score"] or 0),
        }
        for d in docs
    ]