import asyncio
import uuid
from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.security import HTTPBearer

from app.api.deps import SessionDep, get_current_user
from app.core.upload import (
    UploadResponse,
    upload_service,
)
from app.models.startup import Startup
from app.models.upload import BatchUploadResponse, FileMetadata
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["Upload"])
security = HTTPBearer()

'''
# Add these new models
class BatchUploadResponse(BaseModel):
    """Response for batch upload operations"""

    total_files: int
    successful_uploads: List[UploadResponse]
    failed_uploads: List[dict]
    success_count: int
    error_count: int


class StartupFilesRequest(BaseModel):
    """Request model for startup file uploads"""

    startup_name: Optional[str] = None
    startup_id: Optional[str] = None

'''


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
    db: SessionDep,
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
        return await upload_service.upload_image(file, db)
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
    db: SessionDep,
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
        return await upload_service.upload_document(file, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}",
        )


@router.post(
    "/video",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Video",
    description="Upload a video file. Supports MP4, WebM, OGG, QuickTime, and AVI formats.",
)
async def upload_video(
    file: Annotated[UploadFile, File(description="Video file to upload")],
    current_user: Annotated[User, Depends(get_current_user)],
    db: SessionDep,
) -> UploadResponse:
    """
    Upload a video file:

    - **Validates file type and size**
    - **Checks file integrity**
    - **Stores securely in MinIO**
    - **Generates metadata**

    Supported formats:
    - MP4 videos
    - WebM videos
    - OGG videos
    - QuickTime (.mov)
    - AVI videos

    Note: Large video files may take some time to upload.
    """
    try:
        return await upload_service.upload_video(file, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video upload failed: {str(e)}",
        )

        '''
@router.post(
    "/startup-demo-video",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Startup Demo Video",
    description="Upload a demo video for a startup. Supports common video formats with optimized settings.",
)
async def upload_startup_demo_video(
    file: Annotated[UploadFile, File(description="Demo video file to upload")],
    current_user: Annotated[User, Depends(get_current_user)],
    db: SessionDep,
) -> UploadResponse:
    """
    Upload a demo video specifically for startup presentations:

    - **Validates video file type and size (up to 100MB)**
    - **Optimized for startup demo videos**
    - **Stores securely with startup-specific metadata**
    - **Returns URL for frontend integration**

    Supported formats:
    - MP4 (recommended)
    - WebM
    - OGG
    - QuickTime (.mov)

    This endpoint is specifically designed for startup demo videos
    that will be displayed on startup profiles.
    """
    # Additional validation for demo videos
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required for demo videos",
        )

    # Check if user is a founder
    if current_user.role != "founder":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only founders can upload startup demo videos",
        )

    try:
        result = await upload_service.upload_video(file, db)

        # Add startup-specific metadata
        result.file_metadata.update(
            {
                "video_type": "startup_demo",
                "founder_id": str(current_user.id),
                "usage": "startup_profile",
            }
        )

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Demo video upload failed: {str(e)}",
        )

            '''


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
    db: SessionDep,
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
        result = await upload_service.upload_image(file, db)

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
        # Test storage connection using the storage client
        bucket_exists = upload_service.storage_client.bucket_exists()
        return {
            "status": "healthy",
            "service": "upload",
            "storage": "connected" if bucket_exists else "disconnected",
            "bucket": upload_service.bucket_name,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Upload service unhealthy: {str(e)}",
        )


@router.post(
    "/batch",
    response_model=BatchUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Batch Upload Files",
    description="Upload multiple files in parallel. Supports mixed file types with partial success handling.",
)
async def upload_files_batch(
    current_user: Annotated[User, Depends(get_current_user)],
    db: SessionDep,
    files: List[UploadFile] = File(..., description="List of files to upload"),
) -> BatchUploadResponse:
    """
    Upload multiple files in parallel:

    - **Processes files in parallel** for better performance
    - **Handles mixed file types** (images, documents, videos)
    - **Partial success handling** - some files can succeed while others fail
    - **Database transaction safety** - each file gets its own transaction
    - **Progress tracking support**

    Returns detailed results for each file upload attempt.
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided for upload",
        )

    if len(files) > 20:  # Reasonable limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 20 files allowed per batch upload",
        )

    successful_uploads = []
    failed_uploads = []

    # Process files in parallel for better performance
    async def upload_single_file(
        file: UploadFile,
    ) -> tuple[bool, UploadResponse | dict]:
        """Upload a single file and return success status with result"""
        try:
            # Auto-detect file type and route to appropriate service
            content_type = file.content_type or ""

            if content_type.startswith("image/"):
                result = await upload_service.upload_image(file, db)
            elif content_type.startswith("video/"):
                result = await upload_service.upload_video(file, db)
            elif content_type in [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "text/plain",
                "text/csv",
                "application/json",
            ]:
                result = await upload_service.upload_document(file, db)
            else:
                # Default to document upload for unknown types
                result = await upload_service.upload_document(file, db)

            return True, result

        except Exception as e:
            return False, {
                "filename": file.filename,
                "error": str(e),
                "content_type": file.content_type,
            }

    # Execute all uploads in parallel
    tasks = [upload_single_file(file) for file in files]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Process results
    for i, result in enumerate(results):
        if isinstance(result, BaseException):
            failed_uploads.append(
                {
                    "filename": files[i].filename,
                    "error": str(result),
                    "content_type": files[i].content_type,
                }
            )
        else:
            success, data = result
            if success:
                successful_uploads.append(data)
            else:
                failed_uploads.append(data)

    return BatchUploadResponse(
        total_files=len(files),
        successful_uploads=successful_uploads,
        failed_uploads=failed_uploads,
        success_count=len(successful_uploads),
        error_count=len(failed_uploads),
    )


@router.post(
    "/startup-files",
    response_model=BatchUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Startup Files Batch",
    description="Upload all startup-related files in a single atomic transaction.",
)
async def upload_startup_files_batch(
    current_user: Annotated[User, Depends(get_current_user)],
    db: SessionDep,
    logo: Optional[UploadFile] = File(None, description="Startup logo"),
    pitch_deck: Optional[UploadFile] = File(None, description="Pitch deck document"),
    demo_video: Optional[UploadFile] = File(None, description="Demo video"),
    product_screenshots: List[UploadFile] = File(
        default=[], description="Product screenshots"
    ),
    startup_id: Optional[str] = None,
) -> BatchUploadResponse:
    """
    Upload all startup files in a single atomic transaction:

    - **Atomic operation** - either all files succeed or all fail
    - **Optimized for startup creation workflow**
    - **Automatic file type routing**
    - **Built-in rollback on failure**
    - **Startup-specific validation**

    This endpoint is specifically designed for the startup creation process
    and ensures data consistency across all uploaded files.
    """
    # Collect all files with their intended purposes
    files_to_upload = []

    if logo:
        files_to_upload.append(("logo", logo))
    if pitch_deck:
        files_to_upload.append(("pitch_deck", pitch_deck))
    if demo_video:
        files_to_upload.append(("demo_video", demo_video))
    for i, screenshot in enumerate(product_screenshots):
        files_to_upload.append((f"screenshot_{i}", screenshot))

    if not files_to_upload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided for upload",
        )

    # Validate founder role for demo videos
    if demo_video and current_user.role != "Founder":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only founders can upload demo videos",
        )

    successful_uploads = []
    uploaded_file_keys = []

    try:
        # Upload files sequentially for better error tracking in atomic operations
        for file_type, file in files_to_upload:
            try:
                if file_type == "logo" or file_type.startswith("screenshot"):
                    result = await upload_service.upload_image(file, db)
                elif file_type == "demo_video":
                    result = await upload_service.upload_video(file, db)
                elif file_type == "pitch_deck":
                    result = await upload_service.upload_document(file, db)
                else:
                    result = await upload_service.upload_document(file, db)

                # Add startup-specific metadata to the database record
                # We need to update the FileMetadata record in the database
                # Get the file metadata record from database
                file_metadata_record = db.get(FileMetadata, result.file_id)
                if file_metadata_record:
                    # Update the variants field to include startup-specific metadata
                    if not file_metadata_record.variants:
                        file_metadata_record.variants = {}

                    file_metadata_record.variants.update(
                        {
                            "file_purpose": str(file_type),
                            "startup_context": "true",
                            "founder_id": str(current_user.id),
                        }
                    )

                    db.commit()
                    db.refresh(file_metadata_record)

                successful_uploads.append(result)
                uploaded_file_keys.append(result.file_id)

            except Exception as e:
                # Rollback: delete all successfully uploaded files
                if uploaded_file_keys:
                    try:
                        for file_key in uploaded_file_keys:
                            await upload_service.delete_file(file_key)
                    except Exception as cleanup_error:
                        # Log cleanup error but don't mask original error
                        print(f"Cleanup failed: {cleanup_error}")

                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Atomic upload failed at {file_type}: {str(e)}. All uploads rolled back.",
                )

        # Update startup record with file URLs if startup_id is provided
        if startup_id:
            try:
                startup_uuid = uuid.UUID(startup_id)
                startup = db.get(Startup, startup_uuid)

                if startup and startup.founder_id == current_user.id:
                    # Update startup with file URLs
                    for file_type, result in zip(
                        [f[0] for f in files_to_upload], successful_uploads
                    ):
                        if file_type == "logo":
                            startup.logo_url = result.url
                        elif file_type == "pitch_deck":
                            startup.pitch_deck_url = result.url
                        elif file_type == "demo_video":
                            startup.demo_video_url = result.url
                        # Note: product_screenshots would need a separate field in the Startup model

                    db.commit()
                    db.refresh(startup)

            except (ValueError, TypeError) as e:
                # Invalid startup_id format, but don't fail the upload
                print(f"Warning: Invalid startup_id format: {e}")
            except Exception as e:
                # Startup not found or other error, but don't fail the upload
                print(f"Warning: Could not update startup record: {e}")

        return BatchUploadResponse(
            total_files=len(files_to_upload),
            successful_uploads=successful_uploads,
            failed_uploads=[],
            success_count=len(successful_uploads),
            error_count=0,
        )

    except HTTPException:
        raise
    except Exception as e:
        # Final safety net - cleanup any remaining files
        if uploaded_file_keys:
            try:
                for file_key in uploaded_file_keys:
                    await upload_service.delete_file(file_key)
            except Exception:
                pass  # Silent cleanup failure

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Startup files upload failed: {str(e)}",
        )


@router.post(
    "/batch-atomic",
    response_model=BatchUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Atomic Batch Upload Files",
    description="Upload multiple files in parallel with atomic transaction handling. Either all succeed or all fail.",
)
async def upload_files_batch_atomic(
    current_user: Annotated[User, Depends(get_current_user)],
    db: SessionDep,
    files: List[UploadFile] = File(..., description="List of files to upload"),
) -> BatchUploadResponse:
    """
    Upload multiple files with atomic transaction handling:

    - **Processes files in parallel** for better performance
    - **Atomic operation** - either all files succeed or all fail
    - **Handles mixed file types** (images, documents, videos)
    - **Automatic rollback** on any failure
    - **Database transaction safety** - uses shared session with proper error handling

    This endpoint ensures data consistency by rolling back all uploads if any fail.
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided for upload",
        )

    if len(files) > 20:  # Reasonable limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 20 files allowed per batch upload",
        )

    successful_uploads = []
    uploaded_file_keys = []

    async def upload_single_file(
        file: UploadFile,
    ) -> tuple[bool, UploadResponse | dict]:
        """Upload a single file and return success status with result"""
        try:
            # Auto-detect file type and route to appropriate service
            content_type = file.content_type or ""

            if content_type.startswith("image/"):
                result = await upload_service.upload_image(file, db)
            elif content_type.startswith("video/"):
                result = await upload_service.upload_video(file, db)
            elif content_type in [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "text/plain",
                "text/csv",
                "application/json",
            ]:
                result = await upload_service.upload_document(file, db)
            else:
                # Default to document upload for unknown types
                result = await upload_service.upload_document(file, db)

            return True, result

        except Exception as e:
            return False, {
                "filename": file.filename,
                "error": str(e),
                "content_type": file.content_type,
            }

    try:
        # Execute all uploads in parallel
        tasks = [upload_single_file(file) for file in files]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Process results and collect successful uploads
        for i, result in enumerate(results):
            if isinstance(result, BaseException):
                # Any exception means we need to rollback
                raise result
            else:
                success, data = result
                if success:
                    successful_uploads.append(data)
                    if isinstance(data, UploadResponse):
                        uploaded_file_keys.append(data.file_id)
                else:
                    # Any failure means we need to rollback
                    error_msg = (
                        data.get("error", "Unknown error")
                        if isinstance(data, dict)
                        else "Unknown error"
                    )
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Upload failed for {files[i].filename}: {error_msg}",
                    )

        # If we get here, all uploads succeeded
        return BatchUploadResponse(
            total_files=len(files),
            successful_uploads=successful_uploads,
            failed_uploads=[],
            success_count=len(successful_uploads),
            error_count=0,
        )

    except Exception as e:
        # Rollback: delete all successfully uploaded files
        if uploaded_file_keys:
            try:
                for file_key in uploaded_file_keys:
                    await upload_service.delete_file(file_key)
            except Exception as cleanup_error:
                # Log cleanup error but don't mask original error
                print(f"Cleanup failed: {cleanup_error}")

        # Re-raise the original exception
        if isinstance(e, HTTPException):
            raise
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Atomic batch upload failed: {str(e)}",
            )
