import os
from datetime import timedelta, datetime
from typing import List, Mapping, Optional, Tuple, Union
from concurrent.futures import ThreadPoolExecutor
import asyncio

from google.cloud import storage
from google.api_core.exceptions import NotFound

from .base import StorageClient

# backend/app/core/storage/gcs_client.py

-_executor = ThreadPoolExecutor()
+_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="gcs-")


def _get_env(var: str, default: Optional[str] = None) -> str:
    value = os.getenv(var, default)
    if value is None:
        raise RuntimeError(f"Missing required environment variable: {var}")
    return value


class GCSStorageClient(StorageClient):
    def __init__(self, **kwargs):
        self._bucket_name = kwargs.get("bucket_name") or _get_env("GCS_BUCKET_NAME")
        self._project = kwargs.get("project") or os.getenv("GCS_PROJECT")
        self._credentials_path = kwargs.get("credentials_path") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        try:
            self._client = storage.Client(project=self._project)
            self._bucket = self._client.bucket(self._bucket_name)
        except Exception as e:
            raise RuntimeError(f"Failed to initialize GCS client: {e}")

    @property
    def bucket_name(self) -> str:
        return self._bucket_name

    async def upload_file(
        self,
        file_path: str,
        content: bytes,
        content_type: str,
        metadata: Optional[Mapping[str, Union[str, List[str], Tuple[str]]]] = None,
    ) -> str:
        def _upload():
            blob = self._bucket.blob(file_path)
            blob.metadata = dict(metadata) if metadata else None
            blob.upload_from_string(content, content_type=content_type)
            # Make private by default (do not call blob.make_public())
            return blob.public_url  # This will not be accessible unless made public
        await asyncio.get_running_loop().run_in_executor(_executor, _upload)
        # Return the GCS URI (not public URL)
        return f"gs://{self._bucket_name}/{file_path}"

    async def delete_file(self, file_path: str) -> bool:
        def _delete():
            blob = self._bucket.blob(file_path)
            try:
                blob.delete()
                return True
            except NotFound:
                return False
        return await asyncio.get_event_loop().run_in_executor(_executor, _delete)

    def generate_presigned_url(
        self, file_path: str, expires: timedelta = timedelta(hours=1)
    ) -> str:
        blob = self._bucket.blob(file_path)
# Add this to your imports (alongside any existing datetime import)
from datetime import timezone

# Replace the old assignment
expiration = datetime.now(timezone.utc) + expires
        url = blob.generate_signed_url(
            expiration=expiration,
            method="GET",
            version="v4",
        )
        return url

    async def ensure_bucket_exists(self) -> None:
        def _ensure():
            try:
                self._client.get_bucket(self._bucket_name)
            except NotFound:
                self._client.create_bucket(self._bucket_name)
        await asyncio.get_event_loop().run_in_executor(_executor, _ensure)

    def bucket_exists(self) -> bool:
        try:
            self._client.get_bucket(self._bucket_name)
            return True
        except NotFound:
            return False 