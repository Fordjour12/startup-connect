from datetime import datetime
from typing import Dict, Optional, Union

from sqlmodel import JSON, Column, Field, SQLModel


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
    file_metadata: Dict[str, Union[str, int, bool]] = Field(default_factory=dict)
    upload_date: datetime
