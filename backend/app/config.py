from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://yashighosh@localhost:5432/trustfl_hospital_db")
    
    # Fix for Render/Heroku postgres URLs
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    SECRET_KEY: str = os.getenv("SECRET_KEY", "trustfl-super-secret-jwt-key-2026")
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "admin123")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
