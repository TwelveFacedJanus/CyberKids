import asyncio

from .database import tasks
from .seed_tasks import SEED_TASKS


async def seed_tasks_if_empty() -> None:
    count = await tasks.count_documents({})
    if count == 0:
        await tasks.insert_many(SEED_TASKS)
        print(f"Seeded {len(SEED_TASKS)} tasks")


def main() -> None:
    asyncio.run(seed_tasks_if_empty())


if __name__ == "__main__":
    main()

async def seed_tasks_if_empty() -> None:
    count = await tasks.count_documents({})
    if count == 0:
        # 🆕 Добавляем is_enabled: True ко всем заданиям
        tasks_with_enabled = [
            {**task, "is_enabled": task.get("is_enabled", True)}
            for task in SEED_TASKS
        ]
        await tasks.insert_many(tasks_with_enabled)
        print(f"Seeded {len(SEED_TASKS)} tasks")