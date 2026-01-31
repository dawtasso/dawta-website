from pydantic_settings import BaseSettings, SettingsConfigDict


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
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000


settings = Settings()
