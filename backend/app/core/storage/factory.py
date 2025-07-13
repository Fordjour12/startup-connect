"""Storage client factory"""

from app.core.config import settings

from .base import StorageClient
from .gcs_client import GCSStorageClient
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
    storage_backend = (
        kwargs.get("backend") or getattr(settings, "STORAGE_BACKEND", "minio").lower()
    )

    if storage_backend == "gcs":
        # Check required GCS config
        bucket = kwargs.get("bucket_name") or getattr(settings, "GCS_BUCKET_NAME", None)
        if not bucket:
            raise ValueError(
                "GCS_BUCKET_NAME must be set for Google Cloud Storage backend"
            )
        return GCSStorageClient(**kwargs)

    if storage_backend == "minio":
        if not all(
            [
                settings.MINIO_ENDPOINT,
                settings.MINIO_ACCESS_KEY,
                settings.MINIO_SECRET_KEY,
            ]
        ):
            raise ValueError("Storage configuration is incomplete for MinIO backend")
        return MinIOStorageClient(**kwargs)

    raise ValueError(f"Unknown storage backend: {storage_backend}")


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
