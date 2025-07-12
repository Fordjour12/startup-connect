from typing import Any

from sqlmodel import SQLModel


class UploadResponse(SQLModel):
    """Response model for file uploads"""

    file_id: str
    filename: str
    content_type: str
    size: int
    url: str
    thumbnail_url: str | None = None
    metadata: dict[str, Any] = {}
