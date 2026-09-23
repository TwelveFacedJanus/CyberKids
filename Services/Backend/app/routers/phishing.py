from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request

from ..database import phishing_catches as catches_col, tasks as tasks_col
from ..database import results as results_col
from ..dependencies import get_current_user
from ..models import PhishingCatch, Result, Task, User
from ..schemas import PhishingSubmit, PhishingResponse
from ..security import hash_password
from bson import ObjectId

router = APIRouter(prefix="/api/phishing", tags=["phishing"])

ALLOWED_SITES = {"roblox", "steam", "discord", "epic", "minecraft"}


@router.post("/submit", response_model=PhishingResponse)
async def submit_phishing(
    body: PhishingSubmit,
    request: Request,
    user: User = Depends(get_current_user),
):
    """
    Принимает данные с фейкового сайта.
    - Хеширует пароль, сохраняет в phishing_catches.
    - Создаёт Result с task_type='phishing_site', score=0.
    - Возвращает ошибку, имитируя «неверный логин/пароль».
    """
    if body.site not in ALLOWED_SITES:
        raise HTTPException(status_code=400, detail="Unknown site")

    if not body.username or not body.password:
        raise HTTPException(status_code=400, detail="Username and password required")

    catch = PhishingCatch(
        user_id=str(user.id),
        site=body.site,
        fake_url=body.fake_url,
        username_entered=body.username[:200],
        password_hash=hash_password(body.password),
        password_raw=body.password,
        password_length=len(body.password),
        user_agent=request.headers.get("user-agent"),
    )
    await catches_col.insert_one(catch.model_dump(exclude={"id"}))

    task_doc = await tasks_col.find_one({
        "task_type": "phishing_site",
        "content.brand": body.site,
    })

    if task_doc:
        task = Task(**task_doc)
        existing = await results_col.find_one({
            "user_id": str(user.id),
            "task_id": str(task.id),
        })
        result = Result(
            user_id=str(user.id),
            task_id=str(task.id),
            task_title=task.title,
            task_type=task.task_type,
            topic=task.topic,
            score=0,
            max_score=task.points,
            correct_count=0,
            total_count=1,
            answers=[{
                "expected": "Не вводить данные",
                "chosen": f"Ввёл логин и пароль на {body.fake_url}",
                "correct": False,
                "caught": True,
            }],
        )
        if existing:
            await results_col.update_one(
                {"_id": existing["_id"]},
                {"$set": result.model_dump(exclude={"id"})},
            )
        else:
            await results_col.insert_one(result.model_dump(exclude={"id"}))

    return PhishingResponse(
        success=False,
        error="Incorrect username or password. Please try again.",
        caught=True,
    )