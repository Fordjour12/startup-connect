import uuid
from datetime import datetime, timedelta
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps
from sqlmodel import Session

from app.core.config import settings
from app.core.storage import StorageClient, get_default_storage_client
from app.models.upload import FileMetadata, UploadResponse


class FileUploadError(HTTPException):
    """Custom exception for file upload errors"""

    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class UploadService:
    """Production-grade file upload service with pluggable storage backend"""

    def __init__(self, storage_client: Optional[StorageClient] = None):
        self.storage_client = storage_client or get_default_storage_client()
        # Ensure bucket exists on initialization
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self) -> None:
        """Ensure the storage bucket exists"""
        try:
            if not self.storage_client.bucket_exists():
                import asyncio

                # Run async method in sync context
                if hasattr(asyncio, "_get_running_loop"):
                    try:
                        asyncio.get_running_loop()
                        # We're in an async context
                        raise RuntimeError(
                            "Cannot initialize bucket synchronously in async context"
                        )
                    except RuntimeError:
                        # No running loop, we can use asyncio.run
                        asyncio.run(self.storage_client.ensure_bucket_exists())
                else:
                    asyncio.run(self.storage_client.ensure_bucket_exists())
        except Exception as e:
            raise ValueError(f"Failed to initialize storage bucket: {e}")

    def _generate_file_path(
        self, file_type: str, file_id: str, filename: str, variant: str = ""
    ) -> str:
        """Generate organized file path structure"""
        date_path = datetime.now().strftime("%Y/%m/%d")
        variant_suffix = f"_{variant}" if variant else ""
        file_extension = Path(filename).suffix

        return f"{file_type}/{date_path}/{file_id}{variant_suffix}{file_extension}"

    def _validate_file_type(self, file: UploadFile, expected_types: List[str]) -> None:
        """Validate file type against expected types"""
        print(
            f"DEBUG: Validating file type - got: {file.content_type}, expected: {expected_types}"
        )
        if not file.content_type or file.content_type not in expected_types:
            raise FileUploadError(
                f"Invalid file type. Expected: {', '.join(expected_types)}, got: {file.content_type}"
            )

    def _validate_file_size(self, file: UploadFile, max_size: int) -> None:
        """Validate file size"""
        if not file.size:
            raise FileUploadError("File size cannot be determined")

        if file.size > max_size:
            max_mb = max_size / (1024 * 1024)
            raise FileUploadError(f"File too large. Maximum size: {max_mb:.1f}MB")

    async def _read_file_content(self, file: UploadFile) -> bytes:
        """Read file content safely"""
        try:
            content = await file.read()
            await file.seek(0)  # Reset file pointer
            return content
        except Exception as e:
            raise FileUploadError(f"Failed to read file content: {str(e)}")

    def _calculate_checksum(self, content: bytes) -> str:
        """Calculate MD5 checksum for file integrity"""
        import hashlib

        return hashlib.md5(content).hexdigest()

    async def _process_image(
        self, content: bytes, file_id: str, filename: str
    ) -> Dict[str, str]:
        """Process image: resize, optimize, create thumbnails"""
        variants = {}

        try:
            # Open and process image
            image = Image.open(BytesIO(content))

            # Convert to RGB if necessary
            if image.mode in ("RGBA", "P"):
                image = image.convert("RGB")

            # Auto-orient based on EXIF data
            image = ImageOps.exif_transpose(image)

            # Create different variants
            variants_config = {
                "original": None,  # Keep original
                "large": (1920, 1080),
                "medium": (800, 600),
                "small": (400, 300),
                "thumbnail": settings.THUMBNAIL_SIZE,
            }

            for variant_name, size in variants_config.items():
                processed_image = image.copy()

                if size and (image.width > size[0] or image.height > size[1]):
                    processed_image.thumbnail(size, Image.Resampling.LANCZOS)

                # Save processed image
                output = BytesIO()
                processed_image.save(output, format="JPEG", quality=85, optimize=True)
                processed_content = output.getvalue()

                # Upload variant using storage client
                variant_path = self._generate_file_path(
                    "images", file_id, filename, variant_name
                )
                variant_url = await self.storage_client.upload_file(
                    variant_path, processed_content, "image/jpeg"
                )
                variants[variant_name] = variant_url

            return variants

        except Exception as e:
            raise FileUploadError(f"Image processing failed: {str(e)}")

    async def upload_image(self, file: UploadFile, db: Session) -> UploadResponse:
        """Upload and process image files"""
        # Debug logging
        print(f"DEBUG: Filename: {file.filename}")
        print(f"DEBUG: Content-Type: {file.content_type}")
        print(f"DEBUG: File size: {file.size}")
        print(f"DEBUG: Expected types: {settings.ALLOWED_IMAGE_TYPES}")

        # Validation
        if not file.filename:
            raise FileUploadError("Filename is required")
        if not file.content_type:
            raise FileUploadError("Content type is required")

        self._validate_file_type(file, settings.ALLOWED_IMAGE_TYPES)
        self._validate_file_size(file, settings.MAX_IMAGE_SIZE)

        # Generate file ID and read content
        file_id = str(uuid.uuid4())
        content = await self._read_file_content(file)
        checksum = self._calculate_checksum(content)

        # Process image and create variants
        variants = await self._process_image(content, file_id, file.filename)

        # Create metadata
        file_metadata_obj = FileMetadata(
            filename=f"{file_id}{Path(file.filename).suffix}",
            original_filename=file.filename,
            content_type=file.content_type,
            size=len(content),
            upload_date=datetime.now(),
            file_id=file_id,
            file_type="image",
            processed=True,
            thumbnail_url=variants.get("thumbnail"),
            variants=variants,
            checksum=checksum,
        )

        # Save to database
        db.add(file_metadata_obj)
        db.commit()
        db.refresh(file_metadata_obj)

        return UploadResponse(
            success=True,
            file_id=file_id,
            filename=file_metadata_obj.filename,
            content_type=file.content_type,
            size=len(content),
            url=variants.get("original", ""),
            thumbnail_url=variants.get("thumbnail"),
            variants=variants,
            file_metadata=file_metadata_obj.model_dump(),
            upload_date=file_metadata_obj.upload_date,
        )

    async def upload_document(self, file: UploadFile, db: Session) -> UploadResponse:
        """Upload document files"""
        # Validation
        if not file.filename:
            raise FileUploadError("Filename is required")
        if not file.content_type:
            raise FileUploadError("Content type is required")

        self._validate_file_type(file, settings.ALLOWED_DOCUMENT_TYPES)
        self._validate_file_size(file, settings.MAX_FILE_SIZE)

        # Generate file ID and read content
        file_id = str(uuid.uuid4())
        content = await self._read_file_content(file)
        checksum = self._calculate_checksum(content)

        # Upload file using storage client
        file_path = self._generate_file_path("documents", file_id, file.filename)
        url = await self.storage_client.upload_file(
            file_path, content, file.content_type
        )

        # Create metadata
        file_metadata_obj = FileMetadata(
            filename=f"{file_id}{Path(file.filename).suffix}",
            original_filename=file.filename,
            content_type=file.content_type,
            size=len(content),
            upload_date=datetime.now(),
            file_id=file_id,
            file_type="document",
            processed=True,
            checksum=checksum,
        )

        # Save to database
        db.add(file_metadata_obj)
        db.commit()
        db.refresh(file_metadata_obj)

        return UploadResponse(
            success=True,
            file_id=file_id,
            filename=file_metadata_obj.filename,
            content_type=file.content_type,
            size=len(content),
            url=url,
            file_metadata=file_metadata_obj.model_dump(),
            upload_date=file_metadata_obj.upload_date,
        )

    async def upload_video(self, file: UploadFile, db: Session) -> UploadResponse:
        """Upload video files"""
        # Validation
        if not file.filename:
            raise FileUploadError("Filename is required")
        if not file.content_type:
            raise FileUploadError("Content type is required")

        self._validate_file_type(file, settings.ALLOWED_VIDEO_TYPES)
        self._validate_file_size(file, settings.MAX_VIDEO_SIZE)

        # Generate file ID and read content
        file_id = str(uuid.uuid4())
        content = await self._read_file_content(file)
        checksum = self._calculate_checksum(content)

        # Upload file using storage client
        file_path = self._generate_file_path("videos", file_id, file.filename)
        url = await self.storage_client.upload_file(
            file_path, content, file.content_type
        )

        # Create metadata
        file_metadata_obj = FileMetadata(
            filename=f"{file_id}{Path(file.filename).suffix}",
            original_filename=file.filename,
            content_type=file.content_type,
            size=len(content),
            upload_date=datetime.now(),
            file_id=file_id,
            file_type="video",
            processed=True,
            checksum=checksum,
        )

        # Save to database
        db.add(file_metadata_obj)
        db.commit()
        db.refresh(file_metadata_obj)

        return UploadResponse(
            success=True,
            file_id=file_id,
            filename=file_metadata_obj.filename,
            content_type=file.content_type,
            size=len(content),
            url=url,
            file_metadata=file_metadata_obj.model_dump(),
            upload_date=file_metadata_obj.upload_date,
        )

    async def upload_startup_files(
        self, files: Dict[str, UploadFile], startup_id: str, db: Session
    ) -> Dict[str, UploadResponse]:
        """Upload multiple files for a startup profile"""
        results = {}

        # Define file handlers
        handlers = {
            "logo": self.upload_image,
            "pitchDeck": self.upload_document,
            "demoVideo": self.upload_video,
            "productScreenshots": self.upload_image,
        }

        for field_name, file in files.items():
            if file and field_name in handlers:
                try:
                    result = await handlers[field_name](file, db)
                    # Add startup context to metadata
                    result.file_metadata.update(
                        {"startup_id": startup_id, "field_name": field_name}
                    )
                    results[field_name] = result
                except Exception as e:
                    results[field_name] = {"success": False, "error": str(e)}

        return results

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from storage"""
        return await self.storage_client.delete_file(file_path)

    def generate_presigned_url(
        self, file_path: str, expires: timedelta = timedelta(hours=1)
    ) -> str:
        """Generate presigned URL for temporary access"""
        return self.storage_client.generate_presigned_url(file_path, expires)

    @property
    def bucket_name(self) -> str:
        """Get bucket name from storage client"""
        return self.storage_client.bucket_name


# Global upload service instance
upload_service = UploadService()
