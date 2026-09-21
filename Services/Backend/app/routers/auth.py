from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from ..database import users as users_col
from ..dependencies import get_current_user
from ..models import User
from ..schemas import LoginResponse, UserOut
from ..security import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    doc = await users_col.find_one({"username": form.username})
    if not doc or not verify_password(form.password, doc.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Неверное имя пользователя или пароль")
    if not doc.get("is_active", True):
        raise HTTPException(status_code=403, detail="Аккаунт отключён")

    user = User(**doc)
    token = create_access_token(user.username)
    return LoginResponse(access_token=token, user=UserOut(**user.model_dump()))


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)):
    return UserOut(**user.model_dump())