# app/routers/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from ..database import tasks as tasks_col
from ..dependencies import get_current_user
from ..models import Task, User
from ..schemas import TaskFullOut, TaskOut
from app import constants
import base64
from pathlib import Path
import random
from copy import deepcopy

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

def _pick_scam_chat_messages(content: dict) -> dict:
    """Для scam_chat: выбирает случайный набор сообщений из пула."""
    pool = content.get("pool")
    if not pool:
        return content  # старый формат — оставляем как есть

    pick_count = content.get("pickCount", 7)
    min_scam = content.get("minScam", 1)
    max_scam = content.get("maxScam", 4)

    scams = [m for m in pool if m.get("isScam")]
    normal = [m for m in pool if not m.get("isScam")]

    # Сколько мошенников показываем
    scam_count = random.randint(min_scam, max_scam)
    scam_count = min(scam_count, len(scams))
    normal_count = max(1, pick_count - scam_count)
    normal_count = min(normal_count, len(normal))

    picked_scams = random.sample(scams, scam_count)
    picked_normal = random.sample(normal, normal_count)

    mixed = picked_scams + picked_normal
    random.shuffle(mixed)

    # Формируем новый content без pool — фронт видит только messages
    result = {k: v for k, v in content.items() if k != "pool"}
    result["messages"] = mixed
    return result


def _task_out(t: Task) -> TaskOut:
    data = t.model_dump()
    
    if not data.get("imageB64") and data.get("imagePath"):
        image_path = Path(data["imagePath"])
        if image_path.is_file():
            try:
                raw = image_path.read_bytes()
                encoded = base64.b64encode(raw).decode("ascii")
                # Определяем MIME по расширению
                ext = image_path.suffix.lower().lstrip(".")
                mime = {
                    "png": "image/png",
                    "jpg": "image/jpeg",
                    "jpeg": "image/jpeg",
                    "gif": "image/gif",
                    "webp": "image/webp",
                    "svg": "image/svg+xml",
                }.get(ext, "application/octet-stream")
                data["imageB64"] = f"data:{mime};base64,{encoded}"
            except OSError:
                data["imageB64"] = None
    
    return TaskOut(**data)


@router.get("", response_model=list[TaskOut])
async def list_tasks(user: User = Depends(get_current_user)):
    if constants.ROLE_ADMIN in user.roles:
        tasks = await tasks_col.find().sort("order", 1).to_list(1000)
        return [_task_out(Task(**t)) for t in tasks]

    enabled_filter = {"$or": [{"is_enabled": True}, {"is_enabled": {"$exists": False}}]}
    
    # Фильтр по возрастной группе
    age_filter = {"age_groups": user.age_group}
    
    # Фильтр по группам пользователя
    if user.groups:
        group_filter = {
            "$or": [
                {"forbidden_groups": {"$size": 0}},
                {"forbidden_groups": {"$not": {"$in": user.groups}}}
            ]
        }
    else:
        group_filter = {}
    
    query = {"$and": [age_filter, group_filter, enabled_filter]}
    
    tasks = await tasks_col.find(query).sort("order", 1).to_list(1000)
    return [_task_out(Task(**t)) for t in tasks]


@router.get("/{task_id}", response_model=TaskFullOut)
async def get_task(task_id: str, user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=404, detail="Задание не найдено")
    doc = await tasks_col.find_one({"_id": ObjectId(task_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Задание не найдено")

    task = Task(**doc)

    # ✅ Для scam_chat — выбираем случайный набор
    if task.task_type == "scam_chat":
        task.content = _pick_scam_chat_messages(task.content)
    # Если добавишь другие динамические типы — здесь же

    if constants.ROLE_ADMIN in user.roles:
        return TaskFullOut(**task.model_dump())

    if user.age_group not in task.age_groups:
        raise HTTPException(status_code=403, detail="Задание не доступно для вашей возрастной группы")

    if task.forbidden_groups:
        if any(g in user.groups for g in task.forbidden_groups):
            raise HTTPException(status_code=403, detail="Задание запрещено для вашей группы")

    return TaskFullOut(**task.model_dump())