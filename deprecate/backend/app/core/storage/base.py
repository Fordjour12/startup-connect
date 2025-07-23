"""Abstract base class for storage operations"""

from abc import ABC, abstractmethod
from datetime import timedelta
from typing import List, Mapping, Optional, Tuple, Union


class StorageClient(ABC):
    """Abstract base class for file storage operations"""

    @abstractmethod
    def __init__(self, **kwargs):
        """Initialize storage client with configuration"""
        pass

    @abstractmethod
    async def upload_file(
        self,
        file_path: str,
        content: bytes,
        content_type: str,
        metadata: Optional[Mapping[str, Union[str, List[str], Tuple[str]]]] = None,
    ) -> str:
        """
        Upload file to storage and return public URL

        Args:
            file_path: Path where file should be stored
            content: File content as bytes
            content_type: MIME type of the file
            metadata: Optional metadata to store with file

        Returns:
            Public URL of uploaded file
        """
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """
        Delete file from storage

        Args:
            file_path: Path of file to delete

        Returns:
            True if deleted successfully, False otherwise
        """
        pass

    @abstractmethod
    def generate_presigned_url(
        self, file_path: str, expires: timedelta = timedelta(hours=1)
    ) -> str:
        """
        Generate presigned URL for temporary access

        Args:
            file_path: Path of file
            expires: Expiration time for URL

        Returns:
            Presigned URL
        """
        pass

    @abstractmethod
    async def ensure_bucket_exists(self) -> None:
        """Ensure storage bucket/container exists"""
        pass

    @abstractmethod
    def bucket_exists(self) -> bool:
        """Check if bucket exists"""
        pass

    @property
    @abstractmethod
    def bucket_name(self) -> str:
        """Get bucket name"""
        pass
