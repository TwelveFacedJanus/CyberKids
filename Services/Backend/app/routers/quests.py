from datetime import datetime
from fastapi import APIRouter, Depends
from bson import ObjectId

from ..database import quests as quests_col
from ..dependencies import get_current_user
from ..models import User
from ..schemas import QuestProgressIn, QuestProgressOut

router = APIRouter(prefix="/api/quests", tags=["quests"])


@router.post("/alex/complete", response_model=QuestProgressOut)
async def complete_alex_quest(
    body: QuestProgressIn,
    user: User = Depends(get_current_user),
):
    """Сохраняет прохождение квеста ALEX"""
    existing = await quests_col.find_one({
        "user_id": str(user.id),
        "quest_id": "alex",
    })

    data = {
        "user_id": str(user.id),
        "quest_id": "alex",
        "scenes": body.progress,
        "score": body.score,
        "completed_at": datetime.utcnow(),
    }

    if existing:
        await quests_col.update_one(
            {"_id": existing["_id"]},
            {"$set": data},
        )
    else:
        await quests_col.insert_one(data)

    return QuestProgressOut(**data)


@router.get("/alex/me", response_model=QuestProgressOut | None)
async def get_my_alex_progress(user: User = Depends(get_current_user)):
    doc = await quests_col.find_one({
        "user_id": str(user.id),
        "quest_id": "alex",
    })
    if not doc:
        return None
    return QuestProgressOut(
        user_id=doc["user_id"],
        quest_id=doc["quest_id"],
        scenes=doc.get("scenes", {}),
        score=doc.get("score", 0),
        completed_at=doc.get("completed_at"),
    )