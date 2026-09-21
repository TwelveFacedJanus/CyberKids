from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import ping
from .routers import admin, auth, results, tasks, groups, execution, quests
from .seed import seed_tasks_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    await ping()
    await seed_tasks_if_empty()
    print("CyberKids backend is ready")
    yield


app = FastAPI(
    title="CyberKids API",
    description="Весёлое приложение по кибербезопасности для детей",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(results.router)
app.include_router(admin.router)
app.include_router(groups.router)
app.include_router(execution.router)
app.include_router(quests.router)

@app.get("/health")
async def health():
    return {"status": "ok"}