# backend/app/reseed.py
"""Скрипт создания админ-аккаунта.

Примеры:
    python -m app.scripts.reseed
"""

import asyncio
from ..database import tasks
from ..seed_tasks import SEED_TASKS

async def reseed():
    print("🗑️ Удаляем все задания...")
    await tasks.delete_many({})
    
    print(f"📥 Загружаем {len(SEED_TASKS)} заданий...")
    await tasks.insert_many(SEED_TASKS)
    
    count = await tasks.count_documents({})
    print(f"✅ Загружено {count} заданий")

if __name__ == "__main__":
    asyncio.run(reseed())