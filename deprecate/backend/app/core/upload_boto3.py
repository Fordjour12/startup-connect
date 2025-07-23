import uuid
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional, Union

import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps
from pydantic import BaseModel

from app.core.config import settings


class FileMetadata(BaseModel):
    """Metadata for uploaded files"""

    filename: str
    original_filename: str
    content_type: str
    size: int
    upload_date: datetime
    file_id: str
    file_type: str  # 'image', 'document', 'video'
    processed: bool = False
    thumbnail_url: Optional[str] = None
    variants: Dict[str, str] = {}  # Different sizes/formats
    checksum: Optional[str] = None


class UploadResponse(BaseModel):
    """Response model for file uploads"""

    success: bool
    file_id: str
    filename: str
    content_type: str
    size: int
    url: str
    thumbnail_url: Optional[str] = None
    variants: Dict[str, str] = {}
    metadata: Dict[str, Union[str, int, bool]] = {}
    upload_date: datetime


class FileUploadError(HTTPException):
    """Custom exception for file upload errors"""

    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class Boto3UploadService:
    """Production-grade file upload service with Boto3 S3 client"""

    def __init__(self):
        self.s3_client = self._get_s3_client()
        self.bucket_name = settings.MINIO_BUCKET_NAME
        self._ensure_bucket_exists()

    def _get_s3_client(self):
        """Initialize S3 client for MinIO using boto3"""
        if not all(
            [
                settings.MINIO_ENDPOINT,
                settings.MINIO_ACCESS_KEY,
                settings.MINIO_SECRET_KEY,
            ]
        ):
            raise ValueError("MinIO configuration is incomplete")

        # Configure for MinIO (S3-compatible)
        session = boto3.Session(
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_KEY,
        )

        return session.client(
            "s3",
            endpoint_url=f"{'https' if settings.MINIO_SECURE else 'http'}://{settings.MINIO_ENDPOINT}",
            region_name="us-east-1",  # Required but not used in MinIO
            use_ssl=settings.MINIO_SECURE,
        )

    def _ensure_bucket_exists(self) -> None:
        """Ensure the S3 bucket exists"""
        try:
            # Check if bucket exists
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "404":
                # Bucket doesn't exist, create it
                try:
                    self.s3_client.create_bucket(Bucket=self.bucket_name)

                    # Set bucket policy for public read access to public folder
                    bucket_policy = {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Allow",
                                "Principal": "*",
                                "Action": "s3:GetObject",
                                "Resource": f"arn:aws:s3:::{self.bucket_name}/public/*",
                            }
                        ],
                    }

                    import json

                    self.s3_client.put_bucket_policy(
                        Bucket=self.bucket_name, Policy=json.dumps(bucket_policy)
                    )
                except ClientError as create_error:
                    raise ValueError(f"Failed to create bucket: {create_error}")
            else:
                raise ValueError(f"Failed to access bucket: {e}")

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

    async def _upload_to_s3(
        self, file_path: str, content: bytes, content_type: str
    ) -> str:
        """Upload file to S3 (MinIO) and return public URL"""
        try:
            # Upload file using boto3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_path,
                Body=content,
                ContentType=content_type,
                # Add metadata
                Metadata={
                    "uploaded_at": datetime.now().isoformat(),
                    "checksum": self._calculate_checksum(content),
                },
            )

            # Generate public URL
            endpoint = settings.MINIO_ENDPOINT
            protocol = "https" if settings.MINIO_SECURE else "http"
            return f"{protocol}://{endpoint}/{self.bucket_name}/{file_path}"

        except ClientError as e:
            raise FileUploadError(
                f"Failed to upload to storage: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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

                # Upload variant
                variant_path = self._generate_file_path(
                    "images", file_id, filename, variant_name
                )
                variant_url = await self._upload_to_s3(
                    variant_path, processed_content, "image/jpeg"
                )
                variants[variant_name] = variant_url

            return variants

        except Exception as e:
            raise FileUploadError(f"Image processing failed: {str(e)}")

    async def upload_image(self, file: UploadFile) -> UploadResponse:
        """Upload and process image files"""
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
        metadata = FileMetadata(
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

        return UploadResponse(
            success=True,
            file_id=file_id,
            filename=metadata.filename,
            content_type=file.content_type,
            size=len(content),
            url=variants.get("original", ""),
            thumbnail_url=variants.get("thumbnail"),
            variants=variants,
            metadata=metadata.dict(),
            upload_date=metadata.upload_date,
        )

    def generate_presigned_url(self, file_path: str, expires: int = 3600) -> str:
        """Generate presigned URL for temporary access"""
        try:
            return self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_path},
                ExpiresIn=expires,
            )
        except ClientError as e:
            raise FileUploadError(f"Failed to generate presigned URL: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from S3"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_path)
            return True
        except ClientError:
            return False


# Alternative service instance using boto3
boto3_upload_service = Boto3UploadService()
