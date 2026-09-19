from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


# ---------- Auth ----------
class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: str
    username: str
    full_name: str
    age_group: str
    roles: list[str]
    groups: list[str]
    is_active: bool = True
    created_at: datetime


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Users ----------
class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str
    age_group: str = "junior"
    roles: list[str] = ["user"]
    groups: list[str] = []


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    age_group: Optional[str] = None
    roles: Optional[list[str]] = None
    groups: Optional[list[str]] = None
    is_active: Optional[bool] = None


class ResetPassword(BaseModel):
    new_password: str

# ---------- Groups ----------
class GroupCreate(BaseModel):
    name: str
    description: str = ""
    user_ids: list[str] = []


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    user_ids: Optional[list[str]] = None


class GroupOut(BaseModel):
    id: str
    name: str
    description: str
    user_ids: list[str]
    user_count: int = 0  # Количество участников
    created_at: datetime
    created_by: Optional[str] = None

# ---------- Tasks ----------
class TaskOut(BaseModel):
    id: str
    title: str
    description: str
    instructions: str
    topic: str
    imagePath: Optional[str] = ""
    imageB64: Optional[str] = ""
    task_type: str
    age_groups: list[str]
    forbidden_groups: list[str] = []
    points: int
    emoji: str
    color: str
    order: int
    is_enabled: bool = True


class TaskFullOut(TaskOut):
    content: dict[str, Any] = {}


# ---------- Results ----------
class AnswerIn(BaseModel):
    # универсальный ответ: каждый тип задания интерпретирует его по-своему
    payload: dict[str, Any]


class ResultSubmit(BaseModel):
    task_id: str
    answers: list[AnswerIn] = []
    time_spent_sec: int = 0


class ResultOut(BaseModel):
    id: str
    user_id: str
    task_id: str
    task_title: str
    task_type: str
    topic: str
    score: int
    max_score: int
    correct_count: int
    total_count: int
    completed_at: datetime
    score_added: int = 0


class ResultDetailedOut(ResultOut):
    answers: list[dict] = []
    username: str = ""
    full_name: str = ""


# ---------- Stats ----------
class TopicStat(BaseModel):
    topic: str
    attempts: int
    avg_score_percent: float
    best_score_percent: float


class StatsOut(BaseModel):
    total_users: int
    total_attempts: int
    total_completed_tasks: int
    avg_score_percent: float
    by_age_group: dict[str, int]
    by_topic: list[TopicStat]
    hardest_tasks: list[dict] = []

# ---------- AI ----------
class AIPromptResponse(BaseModel):
    response: str
    success: bool
    match_percentage: int = 0
    matched_words: list[str] = []
    error: Optional[str] = None

# ---------- Quests ----------

class QuestProgressIn(BaseModel):
    progress: dict[str, bool]
    score: int = 0

class QuestProgressOut(BaseModel):
    user_id: str
    quest_id: str
    scenes: dict[str, bool]
    score: int
    completed_at: Optional[datetime] = None