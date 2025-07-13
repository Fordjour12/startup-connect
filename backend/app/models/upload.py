from datetime import datetime
from typing import TYPE_CHECKING, Dict, List, Optional, Union

from sqlmodel import JSON, Column, Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class FileMetadata(SQLModel, table=True):
    """Database model for file metadata"""

    file_id: str = Field(primary_key=True)
    filename: str
    original_filename: str
    content_type: str
    size: int
    upload_date: datetime
    file_type: str  # 'image', 'document', 'video'
    processed: bool = False
    thumbnail_url: Optional[str] = None
    variants: Dict[str, str] = Field(
        default_factory=dict, sa_column=Column(JSON)
    )  # Different sizes/formats
    checksum: Optional[str] = None
    user_id: Optional[str] = Field(default=None, foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="files")


class UploadResponse(SQLModel):
    """Response model for file uploads - works for both API responses and database operations"""

    success: bool = True
    file_id: str
    filename: str
    content_type: str
    size: int
    url: str
    thumbnail_url: Optional[str] = None
    variants: Dict[str, str] = Field(default_factory=dict)
    file_metadata: Dict[str, Union[str, int, bool, datetime, dict, None]] = Field(
        default_factory=dict
    )
    upload_date: datetime


# Add these new models
class BatchUploadResponse(SQLModel):
    """Response for batch upload operations"""

    total_files: int
    successful_uploads: List[UploadResponse]
    failed_uploads: List[dict]
    success_count: int
    error_count: int


class StartupFilesRequest(SQLModel):
    """Request model for startup file uploads"""

    startup_name: Optional[str] = None
    startup_id: Optional[str] = None
