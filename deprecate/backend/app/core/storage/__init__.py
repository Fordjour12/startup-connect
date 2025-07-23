"""Storage abstraction layer for file operations"""

from .base import StorageClient
from .factory import get_default_storage_client, get_storage_client
from .minio_client import MinIOStorageClient

__all__ = [
    "get_storage_client",
    "get_default_storage_client",
    "StorageClient",
    "MinIOStorageClient",
]
