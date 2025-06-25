"""MinIO storage client implementation"""

import json
from datetime import timedelta
from io import BytesIO
from typing import List, Mapping, Optional, Tuple, Union

from minio import Minio
from minio.error import S3Error

from app.core.config import settings

from .base import StorageClient


class MinIOStorageError(Exception):
    """Custom exception for MinIO storage errors"""

    pass


class MinIOStorageClient(StorageClient):
    """MinIO storage client implementation"""

    def __init__(self, **kwargs):
        """Initialize MinIO client with configuration"""
        self._bucket_name = kwargs.get("bucket_name", settings.MINIO_BUCKET_NAME)
        self.client = self._get_minio_client()

    def _get_minio_client(self) -> Minio:
        """Initialize MinIO client with configuration"""
        if not all(
            [
                settings.MINIO_ENDPOINT,
                settings.MINIO_ACCESS_KEY,
                settings.MINIO_SECRET_KEY,
            ]
        ):
            raise ValueError("MinIO configuration is incomplete")

        # Type assertion after validation
        endpoint = settings.MINIO_ENDPOINT
        access_key = settings.MINIO_ACCESS_KEY
        secret_key = settings.MINIO_SECRET_KEY

        if not endpoint or not access_key or not secret_key:
            raise ValueError("MinIO configuration values cannot be None")

        return Minio(
            endpoint=endpoint,
            access_key=access_key,
            secret_key=secret_key,
            secure=settings.MINIO_SECURE,
        )

    async def ensure_bucket_exists(self) -> None:
        """Ensure the MinIO bucket exists"""
        try:
            if not self.client.bucket_exists(self._bucket_name):
                self.client.make_bucket(self._bucket_name)

                # Set bucket policy for file access
                policy = {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": "*"},
                            "Action": ["s3:GetObject"],
                            "Resource": [f"arn:aws:s3:::{self._bucket_name}/public/*"],
                        }
                    ],
                }

                self.client.set_bucket_policy(self._bucket_name, json.dumps(policy))
        except S3Error as e:
            raise MinIOStorageError(f"Failed to initialize MinIO bucket: {e}")

    def bucket_exists(self) -> bool:
        """Check if bucket exists"""
        try:
            return self.client.bucket_exists(self._bucket_name)
        except S3Error:
            return False

    async def upload_file(
        self,
        file_path: str,
        content: bytes,
        content_type: str,
        metadata: Optional[Mapping[str, Union[str, List[str], Tuple[str]]]] = None,
    ) -> str:
        """Upload file to MinIO and return public URL"""
        try:
            # Prepare metadata - convert to dict for MinIO compatibility
            object_metadata = dict(metadata) if metadata else {}

            # Upload file
            self.client.put_object(
                bucket_name=self._bucket_name,
                object_name=file_path,
                data=BytesIO(content),
                length=len(content),
                content_type=content_type,
                metadata=object_metadata,  # type: ignore
            )

            # Generate public URL
            return f"http://{settings.MINIO_ENDPOINT}/{self._bucket_name}/{file_path}"

        except S3Error as e:
            raise MinIOStorageError(f"Failed to upload to storage: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from MinIO"""
        try:
            self.client.remove_object(self._bucket_name, file_path)
            return True
        except S3Error:
            return False

    def generate_presigned_url(
        self, file_path: str, expires: timedelta = timedelta(hours=1)
    ) -> str:
        """Generate presigned URL for temporary access"""
        try:
            return self.client.presigned_get_object(
                bucket_name=self._bucket_name, object_name=file_path, expires=expires
            )
        except S3Error as e:
            raise MinIOStorageError(f"Failed to generate presigned URL: {str(e)}")

    @property
    def bucket_name(self) -> str:
        """Get bucket name"""
        return self._bucket_name
