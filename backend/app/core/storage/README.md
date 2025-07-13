# Storage Abstraction Layer

This module provides a clean abstraction layer for file storage operations, making it easy to switch between different storage backends without changing business logic.

## 🏗️ Architecture

```
app/core/storage/
├── __init__.py           # Module exports
├── base.py              # Abstract storage interface
├── minio_client.py      # MinIO implementation
├── s3_client.py         # AWS S3 placeholder
├── factory.py           # Storage client factory
└── README.md           # This file
```

## 🚀 Usage

### Basic Usage

```python
from app.core.storage import get_default_storage_client

# Get the default storage client (currently MinIO)
storage = get_default_storage_client()

# Upload a file
url = await storage.upload_file(
    file_path="documents/2024/01/15/my-file.pdf",
    content=file_bytes,
    content_type="application/pdf",
    metadata={"uploaded_by": "user123"}
)

# Delete a file
success = await storage.delete_file("documents/2024/01/15/my-file.pdf")

# Generate presigned URL
presigned_url = storage.generate_presigned_url(
    "documents/2024/01/15/my-file.pdf",
    expires=timedelta(hours=2)
)
```

### Using in Upload Service

```python
from app.core.storage import StorageClient

class UploadService:
    def __init__(self, storage_client: StorageClient = None):
        self.storage_client = storage_client or get_default_storage_client()
    
    async def upload_image(self, file: UploadFile):
        # Business logic here...
        url = await self.storage_client.upload_file(
            file_path, content, content_type
        )
        return url
```

## 🔧 Adding New Storage Backends

To add a new storage backend (e.g., Google Cloud Storage):

### 1. Create the Client Implementation

```python
# gcp_client.py
from google.cloud import storage
from .base import StorageClient

class GCPStorageClient(StorageClient):
    def __init__(self, **kwargs):
        self._bucket_name = kwargs.get("bucket_name")
        self.client = storage.Client()
    
    async def upload_file(self, file_path, content, content_type, metadata=None):
        # Implement GCP upload logic
        bucket = self.client.bucket(self._bucket_name)
        blob = bucket.blob(file_path)
        blob.upload_from_bytes(content, content_type=content_type)
        return blob.public_url
    
    # Implement other abstract methods...
```

### 2. Update the Factory

```python
# factory.py
def get_storage_client(**kwargs) -> StorageClient:
    backend = kwargs.get("backend", settings.STORAGE_BACKEND)
    
    if backend == "minio":
        return MinIOStorageClient(**kwargs)
    elif backend == "aws_s3":
        return S3StorageClient(**kwargs)
    elif backend == "gcp":
        return GCPStorageClient(**kwargs)
    else:
        raise ValueError(f"Unknown storage backend: {backend}")
```

### 3. Update Configuration

```python
# settings
STORAGE_BACKEND: str = "minio"  # or "aws_s3", "gcp", etc.
```

## 🧪 Testing

### Mocking Storage for Tests

```python
from unittest.mock import AsyncMock
from app.core.storage.base import StorageClient

class MockStorageClient(StorageClient):
    def __init__(self):
        self._bucket_name = "test-bucket"
    
    async def upload_file(self, file_path, content, content_type, metadata=None):
        return f"http://mock-storage.com/{file_path}"
    
    async def delete_file(self, file_path):
        return True
    
    # ... implement other methods

# In your tests
upload_service = UploadService(storage_client=MockStorageClient())
```

## 🎯 Benefits

### ✅ **Separation of Concerns**
- Business logic separated from storage implementation
- Upload service focuses on file processing, not storage details

### ✅ **Easy Testing**
- Mock storage clients for unit tests
- No need for real storage in test environment

### ✅ **Flexibility**
- Switch storage backends via configuration
- Support multiple storage backends simultaneously

### ✅ **Extensibility**
- Add new storage backends by implementing the interface
- No changes needed to existing business logic

### ✅ **Type Safety**
- Full type hints and abstract base class
- Ensures all implementations follow the contract

## 🔒 Current Implementation

### MinIO Storage Client
- **Production Ready**: ✅ Fully implemented
- **Features**: Upload, delete, presigned URLs, bucket management
- **Configuration**: Via environment variables
- **Error Handling**: Custom exceptions with proper error messages

### AWS S3 Storage Client
- **Status**: 🚧 Placeholder implementation
- **Purpose**: Demonstrates extensibility
- **To Complete**: Implement using boto3

### Google Cloud Storage (GCS) Client
- **Production Ready**: ✅ Fully implemented
- **Features**: Upload, delete, presigned URLs, bucket management, metadata support
- **Configuration**: Via environment variables (see below)
- **Access**: Files are private by default; use presigned URLs for access
- **Error Handling**: Custom exceptions with proper error messages

## 📝 Interface Contract

All storage clients must implement:

```python
class StorageClient(ABC):
    async def upload_file(self, file_path, content, content_type, metadata=None) -> str
    async def delete_file(self, file_path: str) -> bool
    def generate_presigned_url(self, file_path: str, expires: timedelta) -> str
    async def ensure_bucket_exists(self) -> None
    def bucket_exists(self) -> bool
    
    @property
    def bucket_name(self) -> str
```

## 🚀 Migration Guide

If you're upgrading from the old MinIO-coupled code:

### Before (Tightly Coupled)
```python
class UploadService:
    def __init__(self):
        self.minio_client = Minio(...)  # Direct MinIO dependency
    
    async def upload(self, file):
        self.minio_client.put_object(...)  # MinIO-specific API
```

### After (Abstracted)
```python
class UploadService:
    def __init__(self, storage_client: StorageClient = None):
        self.storage_client = storage_client or get_default_storage_client()
    
    async def upload(self, file):
        await self.storage_client.upload_file(...)  # Storage-agnostic API
```

This abstraction makes your code more maintainable, testable, and future-proof! 🎉 

## 🔧 Configuration

### MinIO (default)
Set the following environment variables:
- `MINIO_ENDPOINT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET_NAME`
- `STORAGE_BACKEND=minio`

### Google Cloud Storage (GCS)
Set the following environment variables:
- `STORAGE_BACKEND=gcs`
- `GCS_BUCKET_NAME=your-bucket-name`
- `GCS_PROJECT=your-gcp-project-id` (optional, if not set in credentials)
- `GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account.json`

**Note:**
- Files are uploaded as private. Use `generate_presigned_url` to provide temporary access.
- Metadata is supported and passed to GCS as custom metadata.

### Example Usage (GCS)
```python
from app.core.storage import get_storage_client

storage = get_storage_client(backend="gcs")

# Upload a file (private by default)
url = await storage.upload_file(
    file_path="uploads/myfile.txt",
    content=b"hello world",
    content_type="text/plain",
    metadata={"uploaded_by": "user123"}
)

# Generate a presigned URL for download
presigned_url = storage.generate_presigned_url(
    "uploads/myfile.txt",
    expires=timedelta(hours=1)
)
``` 