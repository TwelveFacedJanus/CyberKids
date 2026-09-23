"""Скрипт создания админ-аккаунта.

Примеры:
    python -m app.scripts.create_admin                       # admin / admin123 (роль admin)
    python -m app.scripts.create_admin --username admin --password 123123 --full                     # admin + full (полное управление)
"""

import argparse
import asyncio
import getpass

from app import constants
from ..database import users
from ..models import User
from ..security import hash_password


async def create(username: str, password: str, full: bool) -> None:
    if not username or not password:
        raise ValueError("username и password обязательны")
    if len(password) < 6:
        raise ValueError("Пароль должен быть не короче 6 символов")

    existing = await users.find_one({"username": username})
    roles = [constants.ROLE_ADMIN]
    if full:
        roles.append(constants.ROLE_FULL)

    if existing:
        await users.update_one(
            {"username": username},
            {"$set": {"password_hash": hash_password(password), "roles": roles, "is_active": True}},
        )
        print(f"Админ '{username}' обновлён. Роли: {roles}")
    else:
        user = User(
            username=username,
            full_name=username,
            age_group=constants.AGE_SENIOR,
            roles=roles,
            password_hash=hash_password(password),
        )
        await users.insert_one(user.model_dump(exclude={"id"}))
        print(f"Админ '{username}' создан. Роли: {roles}")

    print("Доступ:")
    print("  admin        — просмотр пользователей и результатов")
    print("  admin + full — полное управление (создание/изменение/удаление)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Создание админ-аккаунта")
    parser.add_argument("--username", default=None)
    parser.add_argument("--password", default=None)
    parser.add_argument("--full", action="store_true",
                        help="добавить роль full (полное управление), работает только вместе с admin")
    args = parser.parse_args()

    username = args.username or input("Имя пользователя: ").strip()
    if args.password:
        password = args.password
    else:
        password = getpass.getpass("Пароль: ")

    asyncio.run(create(username, password, args.full))


if __name__ == "__main__":
    main()