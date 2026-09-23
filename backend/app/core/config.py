from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# The whole project shares one .env file in the repository root.
ROOT_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT_ENV_FILE, extra="ignore")

    supabase_url: str
    supabase_anon_key: str

    # Set COOKIE_SECURE=true in production (HTTPS) so the session cookies are
    # never sent over plain HTTP. Leave it false for local development.
    cookie_secure: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
