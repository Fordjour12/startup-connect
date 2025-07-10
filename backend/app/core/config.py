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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300000

    # Database
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "startupconnect"

    # SMTP Configuration
    SMTP_HOST: str | None = "sandbox.smtp.mailtrap.io"
    SMTP_PORT: int = 2525
    SMTP_USERNAME: str | None = "6d42aeb245abf1"
    SMTP_PASSWORD: str | None = "367b2b69c52173"
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False

    # MinIO/S3 Configuration
    MINIO_ENDPOINT: str | None = None  # Default for local development
    MINIO_ACCESS_KEY: str | None = None  # Maps to MINIO_ROOT_USER
    MINIO_SECRET_KEY: str | None = None  # Maps to MINIO_ROOT_PASSWORD
    MINIO_SECURE: bool = False  # Set to True in production with SSL
    MINIO_BUCKET_NAME: str = "startup-connect-files"

    # Public URL configuration for file access
    # MINIO_PUBLIC_ENDPOINT: str | None = None  # Use for CDN or public URL if different from MINIO_ENDPOINT

    # File Upload Configuration
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    MAX_IMAGE_SIZE: int = 10 * 1024 * 1024  # 10MB
    MAX_VIDEO_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_IMAGE_TYPES: list[str] = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "image/svg",
        "image/jpg",
    ]
    ALLOWED_DOCUMENT_TYPES: list[str] = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/csv",
        "application/json",
    ]
    ALLOWED_VIDEO_TYPES: list[str] = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
        "video/x-msvideo",
    ]

    # Image Processing
    IMAGE_MAX_WIDTH: int = 2048
    IMAGE_MAX_HEIGHT: int = 2048
    THUMBNAIL_SIZE: tuple[int, int] = (300, 300)

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
