"""Storage client factory"""

from app.core.config import settings

from .base import StorageClient
from .minio_client import MinIOStorageClient


def get_storage_client(**kwargs) -> StorageClient:
    """
    Factory function to get the appropriate storage client

    Args:
        **kwargs: Additional configuration for storage client

    Returns:
        StorageClient: Configured storage client instance

    Raises:
        ValueError: If storage backend is not configured or unknown
    """
    # For now, we only support MinIO, but this can be extended
    # to support other backends like AWS S3, Google Cloud Storage, etc.

    if not all(
        [
            settings.MINIO_ENDPOINT,
            settings.MINIO_ACCESS_KEY,
            settings.MINIO_SECRET_KEY,
        ]
    ):
        raise ValueError("Storage configuration is incomplete")

    # Currently defaulting to MinIO
    # In the future, you could add logic like:
    # storage_backend = kwargs.get("backend", settings.STORAGE_BACKEND)
    # if storage_backend == "aws_s3":
    #     return AWSS3StorageClient(**kwargs)
    # elif storage_backend == "gcp":
    #     return GCPStorageClient(**kwargs)
    # else:
    #     return MinIOStorageClient(**kwargs)

    return MinIOStorageClient(**kwargs)


# Singleton pattern for storage client
_storage_client: StorageClient | None = None


def get_default_storage_client() -> StorageClient:
    """
    Get a singleton instance of the default storage client

    Returns:
        StorageClient: Default storage client instance
    """
    global _storage_client

    if _storage_client is None:
        _storage_client = get_storage_client()

    return _storage_client


def reset_storage_client() -> None:
    """Reset the singleton storage client (useful for testing)"""
    global _storage_client
    _storage_client = None
