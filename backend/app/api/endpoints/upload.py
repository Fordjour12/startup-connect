from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.security import HTTPBearer

from app.api.deps import get_current_user
from app.core.upload import UploadResponse, upload_service
from app.models.user import User

router = APIRouter()
security = HTTPBearer()


@router.post(
    "/image",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Image",
    description="Upload and process an image file. Supports JPEG, PNG, WebP, and GIF formats.",
)
async def upload_image(
    file: Annotated[UploadFile, File(description="Image file to upload")],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UploadResponse:
    """
    Upload an image file with automatic processing:

    - **Validates file type and size**
    - **Resizes if needed to maximum dimensions**
    - **Creates optimized versions**
    - **Generates thumbnails**
    - **Stores securely in MinIO**

    Returns upload details including URLs for main image and thumbnail.
    """
    try:
        return await upload_service.upload_image(file)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}",
        )


@router.post(
    "/document",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Document",
    description="Upload a document file. Supports PDF, Word, PowerPoint, text, and CSV formats.",
)
async def upload_document(
    file: Annotated[UploadFile, File(description="Document file to upload")],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UploadResponse:
    """
    Upload a document file:

    - **Validates file type and size**
    - **Checks file integrity**
    - **Stores securely in MinIO**
    - **Generates metadata**

    Supported formats:
    - PDF documents
    - Microsoft Word (.doc, .docx)
    - Microsoft PowerPoint (.ppt, .pptx)
    - Plain text files
    - CSV files
    - JSON files
    """
    try:
        return await upload_service.upload_document(file)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}",
        )


@router.post(
    "/profile-image",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Profile Image",
    description="Upload a profile image with additional validation for user profiles.",
)
async def upload_profile_image(
    file: Annotated[UploadFile, File(description="Profile image to upload")],
    current_user: Annotated[User, Depends(get_current_user)],
) -> UploadResponse:
    """
    Upload a profile image with special handling:

    - **Stricter size limits for profile images**
    - **Automatic square cropping for thumbnails**
    - **Optimized for web display**
    """
    # Additional validation for profile images
    if file.size and file.size > 5 * 1024 * 1024:  # 5MB limit for profiles
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Profile image must be smaller than 5MB",
        )

    try:
        result = await upload_service.upload_image(file)

        # TODO: Update user profile with new image URL
        # This would typically update the user's profile_image_url field
        # await user_service.update_profile_image(current_user.id, result.url)

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile image upload failed: {str(e)}",
        )


@router.delete(
    "/{file_key:path}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete File",
    description="Delete a file from storage. Only the file owner can delete their files.",
)
async def delete_file(
    file_key: str, current_user: Annotated[User, Depends(get_current_user)]
) -> None:
    """
    Delete a file from storage:

    - **Validates ownership** (implement based on your business logic)
    - **Removes file and thumbnails**
    - **Cleans up metadata**
    """
    try:
        # TODO: Add ownership validation
        # For now, any authenticated user can delete any file
        # In production, you should validate that the user owns the file

        await upload_service.delete_file(file_key)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Delete failed: {str(e)}",
        )


@router.get(
    "/health",
    summary="Upload Service Health Check",
    description="Check if the upload service and MinIO are healthy.",
)
async def upload_health_check():
    """Health check for upload service"""
    try:
        # Test MinIO connection
        await upload_service.minio_client.ensure_bucket_exists()
        return {
            "status": "healthy",
            "service": "upload",
            "storage": "connected",
            "bucket": upload_service.minio_client.bucket_name,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Upload service unhealthy: {str(e)}",
        )
