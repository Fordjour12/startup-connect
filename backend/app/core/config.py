import secrets

from dotenv import load_dotenv
from pydantic import (
    PostgresDsn,
    computed_field,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_ignore_empty=True,
        case_sensitive=True,
        extra="ignore",
        validate_assignment=True,
        frozen=True,
    )

    PROJECT_NAME: str = "StartupConnect"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300

    # Database
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "startupconnect"

    # SMTP Configuration
    SMTP_HOST: str|None = "sandbox.smtp.mailtrap.io"
    SMTP_PORT: int = 2525
    SMTP_USERNAME: str|None = "6d42aeb245abf1"
    SMTP_PASSWORD: str|None = "367b2b69c52173"
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False

    # Environment
    ENVIRONMENT: str = "development"  # development, staging, production

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URL(self) -> PostgresDsn | None:
        if not all([self.POSTGRES_USER, self.POSTGRES_PASSWORD, self.POSTGRES_HOST]):
            return None
        return MultiHostUrl.build(
            scheme="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )  # type: ignore

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["*"]


settings = Settings()  
