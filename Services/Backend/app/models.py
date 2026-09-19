from datetime import datetime
from typing import Any, Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator


def to_str_id(obj: Any) -> Any:
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict) and "_id" in obj:
        obj["_id"] = str(obj["_id"])
    return obj

class Group(BaseModel):
    """Модель группы пользователей"""
    model_config = ConfigDict(extra="ignore")
    
    id: Optional[str] = Field(default=None, alias="_id")
    name: str                           # Название группы (например, "7А класс")
    description: str = ""               # Описание группы
    user_ids: list[str] = []            # ID пользователей в группе
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None    # ID администратора, создавшего группу
    
    @field_validator("id", mode="before")
    @classmethod
    def _oid(cls, v: Any) -> Any:
        return str(v) if isinstance(v, ObjectId) else v


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: Optional[str] = Field(default=None, alias="_id")
    username: str
    full_name: str
    age_group: str
    roles: list[str] = ["user"]
    groups: list[str] = []
    password_hash: str = ""
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("id", mode="before")
    @classmethod
    def _oid(cls, v: Any) -> Any:
        return str(v) if isinstance(v, ObjectId) else v


class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    description: str
    instructions: str
    imagePath: Optional[str] = Field(default=None)
    imageB64: Optional[str] = Field(default=None)
    topic: str
    task_type: str
    age_groups: list[str]
    forbidden_groups: list[str] = []
    points: int = 10
    emoji: str = "🌟"
    color: str = "#7C4DFF"
    order: int = 0
    content: dict[str, Any] = {}
    is_enabled: bool = True

    @field_validator("id", mode="before")
    @classmethod
    def _oid(cls, v: Any) -> Any:
        return str(v) if isinstance(v, ObjectId) else v


class Result(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    task_id: str
    task_title: str
    task_type: str
    topic: str
    score: int
    max_score: int
    correct_count: int
    total_count: int
    answers: list[dict] = []
    completed_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("id", mode="before")
    @classmethod
    def _oid(cls, v: Any) -> Any:
        return str(v) if isinstance(v, ObjectId) else v

class QuestProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    quest_id: str = "alex"
    scenes: dict[str, bool] = {}
    score: int = 0
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("id", mode="before")
    @classmethod
    def _oid(cls, v: Any) -> Any:
        return str(v) if isinstance(v, ObjectId) else v
