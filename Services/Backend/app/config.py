from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "cyberkids"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # PYTHON_INTERPRETER_URL: str = "http://python-interpreter:9001/execute"
    # NODEJS_INTERPRETER_URL: str = "http://nodejs-interpreter:9002/execute"
    # LUA_INTERPRETER_URL: str = "http://lua-interpreter:9003/execute"
    PYTHON_INTERPRETER_URL: str = "http://localhost:9001/execute"
    NODEJS_INTERPRETER_URL: str = "http://localhost:9002/execute"
    LUA_INTERPRETER_URL: str = "http://localhost:9003/execute"


settings = Settings()