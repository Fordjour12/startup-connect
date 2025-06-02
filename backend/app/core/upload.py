import asyncio
import hashlib
import os
import uuid
from datetime import datetime
from io import BytesIO
from typing import Any, BinaryIO

import boto3
import magic
from botocore.config import Config
from botocore.exceptions import ClientError
from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps
from pydantic import BaseModel

from app.core.config import settings
# from app.models import UploadResponse


class UploadResponse(BaseModel):
   """Response model for file uploads"""

   file_id: str
   filename: str
   content_type: str
   size: int
   url: str
   thumbnail_url: str | None = None
   metadata: dict[str, Any] = {}


class FileValidator:
    """Handles file validation and security checks"""

    @staticmethod
    def validate_file_size(file: UploadFile, max_size: int) -> None:
        """Validate file size"""
        if not hasattr(file.file, "seek") or not hasattr(file.file, "tell"):
            raise HTTPException(status_code=400, detail="Invalid file object")

        # Get file size
        file.file.seek(0, 2)  # Seek to end
        size = file.file.tell()
        file.file.seek(0)  # Reset to beginning

        if size > max_size:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {max_size // (1024 * 1024)}MB",
            )

    @staticmethod
    async def validate_file_type(file: UploadFile, allowed_types: list[str]) -> str:
        """Validate file type using python-magic for security"""
        if not file.filename:
            raise HTTPException(status_code=400, detail="Filename is required")

        # Read file content for magic detection
        content = await file.read()
        await file.seek(0)  # Reset file pointer

        # Detect actual file type
        detected_type = magic.from_buffer(content, mime=True)

        # Validate against allowed types
        if detected_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type '{detected_type}' not allowed. Allowed types: {allowed_types}",
            )

        return detected_type

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename for security"""
        # Remove path separators and other dangerous characters
        filename = os.path.basename(filename)
        filename = "".join(c for c in filename if c.isalnum() or c in "._-")

        # Ensure filename is not empty
        if not filename:
            filename = "unnamed_file"

        return filename[:255]  # Limit length


class ImageProcessor:
    """Handles image processing and optimization"""

    @staticmethod
    def resize_image(
        image: Image.Image, max_width: int, max_height: int
    ) -> Image.Image:
        """Resize image while maintaining aspect ratio"""
        # Convert to RGB if necessary
        if image.mode in ("RGBA", "LA", "P"):
            background = Image.new("RGB", image.size, (255, 255, 255))
            if image.mode == "P":
                image = image.convert("RGBA")
            background.paste(
                image, mask=image.split()[-1] if image.mode == "RGBA" else None
            )
            image = background

        # Auto-orient based on EXIF data
        image = ImageOps.exif_transpose(image)

        # Calculate new size maintaining aspect ratio
        ratio = min(max_width / image.width, max_height / image.height)
        if ratio < 1:
            new_size = (int(image.width * ratio), int(image.height * ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)

        return image

    @staticmethod
    def create_thumbnail(image: Image.Image, size: tuple[int, int]) -> Image.Image:
        """Create thumbnail with proper aspect ratio"""
        thumbnail = image.copy()
        thumbnail.thumbnail(size, Image.Resampling.LANCZOS)
        return thumbnail

    @staticmethod
    def optimize_image(
        image: Image.Image, format: str = "JPEG", quality: int = 85
    ) -> BytesIO:
        """Optimize image for web"""
        output = BytesIO()

        # Set optimization parameters based on format
        if format.upper() == "JPEG":
            image.save(output, format=format, quality=quality, optimize=True)
        elif format.upper() == "PNG":
            image.save(output, format=format, optimize=True)
        elif format.upper() == "WEBP":
            image.save(output, format=format, quality=quality, optimize=True)
        else:
            image.save(output, format=format)

        output.seek(0)
        return output


class MinIOClient:
    """MinIO/S3 client wrapper"""

    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=f"http{'s' if settings.MINIO_SECURE else ''}://{settings.MINIO_ENDPOINT}",
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_KEY,
            config=Config(
                signature_version="s3v4",
                retries={"max_attempts": 3, "mode": "adaptive"},
            ),
            use_ssl=settings.MINIO_SECURE,
        )
        self.bucket_name = settings.MINIO_BUCKET_NAME

    async def ensure_bucket_exists(self) -> None:
        """Ensure the bucket exists, create if not"""
        try:
            await asyncio.to_thread(self.client.head_bucket, Bucket=self.bucket_name)
        except ClientError as e:
            if e.response["Error"]["Code"] == "404":
                await asyncio.to_thread(
                    self.client.create_bucket, Bucket=self.bucket_name
                )
            else:
                raise HTTPException(status_code=500, detail=f"Storage error: {str(e)}")

    async def upload_file(
        self,
        file_data: BinaryIO,
        key: str,
        content_type: str,
        metadata: dict[str, str] | None = None,
    ) -> str:
        """Upload file to MinIO"""
        try:
            extra_args = {"ContentType": content_type, "Metadata": metadata or {}}

            await asyncio.to_thread(
                self.client.upload_fileobj,
                file_data,
                self.bucket_name,
                key,
                ExtraArgs=extra_args,
            )

            # Generate URL
            url = f"http{'s' if settings.MINIO_SECURE else ''}://{settings.MINIO_ENDPOINT}/{self.bucket_name}/{key}"
            return url

        except ClientError as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    async def delete_file(self, key: str) -> None:
        """Delete file from MinIO"""
        try:
            await asyncio.to_thread(
                self.client.delete_object, Bucket=self.bucket_name, Key=key
            )
        except ClientError as e:
            raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")


class FileUploadService:
    """Main file upload service"""

    def __init__(self):
        self.minio_client = MinIOClient()
        self.validator = FileValidator()
        self.image_processor = ImageProcessor()

    def _generate_file_key(self, filename: str, file_type: str) -> str:
        """Generate unique file key with organized folder structure"""
        timestamp = datetime.utcnow().strftime("%Y/%m/%d")
        file_id = str(uuid.uuid4())
        sanitized_name = self.validator.sanitize_filename(filename)

        # Organize by file type
        if file_type.startswith("image/"):
            folder = "images"
        elif file_type == "application/pdf":
            folder = "documents"
        else:
            folder = "files"

        return f"{folder}/{timestamp}/{file_id}_{sanitized_name}"

    def _calculate_file_hash(self, content: bytes) -> str:
        """Calculate SHA-256 hash of file content"""
        return hashlib.sha256(content).hexdigest()

    async def upload_image(self, file: UploadFile) -> UploadResponse:
        """Upload and process image file"""
        # Validate file
        self.validator.validate_file_size(file, settings.MAX_IMAGE_SIZE)
        detected_type = await self.validator.validate_file_type(
            file, settings.ALLOWED_IMAGE_TYPES
        )

        # Read file content
        content = await file.read()
        file_hash = self._calculate_file_hash(content)

        # Process image
        try:
            image = Image.open(BytesIO(content))

            # Resize if necessary
            if (
                image.width > settings.IMAGE_MAX_WIDTH
                or image.height > settings.IMAGE_MAX_HEIGHT
            ):
                image = self.image_processor.resize_image(
                    image, settings.IMAGE_MAX_WIDTH, settings.IMAGE_MAX_HEIGHT
                )

            # Create optimized version
            optimized_image = self.image_processor.optimize_image(image)

            # Create thumbnail
            thumbnail = self.image_processor.create_thumbnail(
                image, settings.THUMBNAIL_SIZE
            )
            thumbnail_data = self.image_processor.optimize_image(thumbnail)

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

        # Generate file keys
        file_key = self._generate_file_key(file.filename or "image", detected_type)
        thumbnail_key = f"thumbnails/{file_key}"

        # Ensure bucket exists
        await self.minio_client.ensure_bucket_exists()

        # Upload files
        metadata = {
            "original-filename": file.filename or "",
            "file-hash": file_hash,
            "upload-timestamp": datetime.utcnow().isoformat(),
        }

        # Upload main image
        url = await self.minio_client.upload_file(
            optimized_image, file_key, detected_type, metadata
        )

        # Upload thumbnail
        thumbnail_url = await self.minio_client.upload_file(
            thumbnail_data, thumbnail_key, detected_type, metadata
        )

        return UploadResponse(
            file_id=file_key.split("/")[-1].split("_")[0],
            filename=file.filename or "image",
            content_type=detected_type,
            size=len(optimized_image.getvalue()),
            url=url,
            thumbnail_url=thumbnail_url,
            metadata={
                "hash": file_hash,
                "dimensions": f"{image.width}x{image.height}",
                "original_size": len(content),
            },
        )

    async def upload_document(self, file: UploadFile) -> UploadResponse:
        """Upload document file"""
        # Validate file
        self.validator.validate_file_size(file, settings.MAX_FILE_SIZE)
        detected_type = await self.validator.validate_file_type(
            file, settings.ALLOWED_DOCUMENT_TYPES
        )

        # Read file content
        content = await file.read()
        file_hash = self._calculate_file_hash(content)

        # Generate file key
        file_key = self._generate_file_key(file.filename or "document", detected_type)

        # Ensure bucket exists
        await self.minio_client.ensure_bucket_exists()

        # Upload file
        metadata = {
            "original-filename": file.filename or "",
            "file-hash": file_hash,
            "upload-timestamp": datetime.utcnow().isoformat(),
        }

        url = await self.minio_client.upload_file(
            BytesIO(content), file_key, detected_type, metadata
        )

        return UploadResponse(
            file_id=file_key.split("/")[-1].split("_")[0],
            filename=file.filename or "document",
            content_type=detected_type,
            size=len(content),
            url=url,
            metadata={"hash": file_hash, "original_size": len(content)},
        )

    async def delete_file(self, file_key: str) -> None:
        """Delete file and its thumbnail if exists"""
        await self.minio_client.delete_file(file_key)

        # Try to delete thumbnail (ignore if doesn't exist)
        try:
            thumbnail_key = f"thumbnails/{file_key}"
            await self.minio_client.delete_file(thumbnail_key)
        except HTTPException:
            pass  # Thumbnail might not exist


# Singleton instance
upload_service = FileUploadService()
