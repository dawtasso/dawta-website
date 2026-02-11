from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from dotenv import load_dotenv

load_dotenv()

def _get_default_data_dir() -> str:
    """Calculate default data directory path.

    For local development: goes up from backend/src to repo root, then into data/
    For Docker: can be overridden via DATA_DIR environment variable to /app/data
    """
    # backend/src/settings.py -> backend/src -> backend -> repo root -> data
    return str(Path(__file__).parent.parent.parent / "data")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # API settings
    api_title: str = "dawta API"
    api_version: str = "0.1.0"
    api_prefix: str = "/api"

    # CORS settings
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://dawta.netlify.app",
        "https://dawta.fr",
        "https://www.dawta.fr",
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from comma-separated string if provided as string."""
        if isinstance(v, str):
            # Split by comma and strip whitespace, filter out empty strings
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000  # Railway provides PORT env var automatically

    # Data directory settings
    # Default works for local development, override with DATA_DIR=/app/data for Docker
    data_dir: str = _get_default_data_dir()

    # Supabase settings
    supabase_url: str = os.getenv("SUPABASE_URL")
    supabase_key: str = os.getenv("SUPABASE_KEY")


settings = Settings()

DATA_DIR = Path(settings.data_dir)
