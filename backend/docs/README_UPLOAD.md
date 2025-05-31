# 📁 Production-Grade File Upload System

A comprehensive file and image upload system for the StartupConnect platform, built with FastAPI, MinIO (S3-compatible), and advanced security features.

## 🚀 Features

### Security & Validation
- **File Type Validation**: Uses `python-magic` for true file type detection (not just extension)
- **Size Limits**: Configurable size limits for different file types
- **Filename Sanitization**: Prevents path traversal and injection attacks
- **Content Scanning**: SHA-256 hashing for file integrity
- **Authentication Required**: All endpoints require valid JWT tokens

### Image Processing
- **Automatic Optimization**: Compresses images for web delivery
- **Smart Resizing**: Maintains aspect ratio while respecting size limits
- **Thumbnail Generation**: Creates optimized thumbnails (300x300px)
- **EXIF Handling**: Auto-rotates based on EXIF orientation
- **Format Support**: JPEG, PNG, WebP, GIF

### Document Handling
- **Multiple Formats**: PDF, Word, PowerPoint, Text, CSV, JSON
- **Metadata Extraction**: Stores upload timestamp, hash, original filename
- **Organized Storage**: Date-based folder structure with type categorization

### Storage Architecture
```
startup-connect-files/
├── images/
│   └── 2024/01/15/
│       ├── uuid_filename.jpg
│       └── ...
├── documents/
│   └── 2024/01/15/
│       ├── uuid_document.pdf
│       └── ...
├── thumbnails/
│   └── images/2024/01/15/
│       ├── uuid_filename.jpg
│       └── ...
└── files/
    └── 2024/01/15/
        └── ...
```

## 🛠️ Setup & Configuration

### 1. Dependencies
```bash
# Install required packages
pip install boto3 pillow python-magic python-multipart
```

### 2. System Dependencies
```bash
# Ubuntu/Debian
sudo apt-get install libmagic1

# macOS
brew install libmagic

# Windows
# Download and install python-magic-bin
pip install python-magic-bin
```

### 3. Environment Variables
```env
# MinIO/S3 Configuration
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_SECURE=false
MINIO_BUCKET_NAME=startup-connect-files

# File Upload Limits
MAX_FILE_SIZE=52428800        # 50MB
MAX_IMAGE_SIZE=10485760       # 10MB
IMAGE_MAX_WIDTH=2048
IMAGE_MAX_HEIGHT=2048
```

### 4. Docker Setup
The system is configured to work with the MinIO container defined in `docker-compose.yml`:

```bash
# Start services
docker-compose up -d

# Access MinIO Console
# URL: http://localhost:9001
# Username: minioadmin
# Password: minioadmin123
```

## 📊 API Endpoints

### Image Upload
```http
POST /api/v1/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <image_file>
```

**Response:**
```json
{
  "file_id": "uuid-string",
  "filename": "image.jpg",
  "content_type": "image/jpeg",
  "size": 245760,
  "url": "http://localhost:9000/startup-connect-files/images/2024/01/15/uuid_image.jpg",
  "thumbnail_url": "http://localhost:9000/startup-connect-files/thumbnails/images/2024/01/15/uuid_image.jpg",
  "metadata": {
    "hash": "sha256-hash",
    "dimensions": "1920x1080",
    "original_size": 2560000
  }
}
```

### Document Upload
```http
POST /api/v1/upload/document
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <document_file>
```

### Profile Image Upload
```http
POST /api/v1/upload/profile-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <image_file>
```

### File Deletion
```http
DELETE /api/v1/upload/{file_key}
Authorization: Bearer {token}
```

### Health Check
```http
GET /api/v1/upload/health
```

## 🔧 Usage Examples

### Frontend Integration (JavaScript)
```javascript
// Upload image
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/v1/upload/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return await response.json();
}

// Upload with progress tracking
async function uploadWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.open('POST', '/api/v1/upload/image');
    xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    xhr.send(formData);
  });
}
```

### Python Client Usage
```python
import requests

def upload_file(file_path: str, auth_token: str):
    with open(file_path, 'rb') as f:
        files = {'file': f}
        headers = {'Authorization': f'Bearer {auth_token}'}
        
        response = requests.post(
            'http://localhost:8000/api/v1/upload/image',
            files=files,
            headers=headers
        )
        
        return response.json()
```

## 🛡️ Security Features

### File Type Validation
```python
# Uses python-magic for true file type detection
detected_type = magic.from_buffer(content, mime=True)

# Validates against allowed types
ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png", 
    "image/webp",
    "image/gif"
]
```

### Filename Sanitization
```python
def sanitize_filename(filename: str) -> str:
    # Remove path separators and dangerous characters
    filename = os.path.basename(filename)
    filename = "".join(c for c in filename if c.isalnum() or c in "._-")
    return filename[:255]  # Limit length
```

### Content Hashing
```python
def calculate_file_hash(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()
```

## 🔄 Integration Points

### User Profile Integration
```python
# Example integration with user profiles
@router.post("/profile-image")
async def upload_profile_image(
    file: UploadFile,
    current_user: User = Depends(get_current_active_user)
):
    result = await upload_service.upload_image(file)
    
    # Update user profile
    await user_service.update_profile_image(
        current_user.id, 
        result.url,
        result.thumbnail_url
    )
    
    return result
```

### Startup Document Integration
```python
# Example for startup pitch decks
@router.post("/startup/{startup_id}/documents")
async def upload_startup_document(
    startup_id: int,
    file: UploadFile,
    current_user: User = Depends(get_current_active_user)
):
    # Validate ownership
    startup = await startup_service.get_by_id(startup_id)
    if startup.founder_id != current_user.id:
        raise HTTPException(403, "Not authorized")
    
    result = await upload_service.upload_document(file)
    
    # Save document reference
    await document_service.create_document(
        startup_id=startup_id,
        file_url=result.url,
        file_type=result.content_type,
        original_name=result.filename
    )
    
    return result
```

## 📈 Performance Considerations

### Async Operations
- All file operations use `asyncio.to_thread()` for non-blocking I/O
- Concurrent uploads supported
- Efficient memory usage with streaming

### Image Optimization
- JPEG quality: 85% (configurable)
- PNG optimization enabled
- WebP support for modern browsers
- Lazy loading friendly URLs

### Caching Strategy
```python
# Example CDN integration
def get_cdn_url(file_url: str) -> str:
    if settings.CDN_ENABLED:
        return file_url.replace(
            settings.MINIO_ENDPOINT,
            settings.CDN_ENDPOINT
        )
    return file_url
```

## 🧪 Testing

Run the test script:
```bash
python test_upload.py
```

Test coverage includes:
- File type validation
- Size limit enforcement
- Image processing pipeline
- Error handling
- Authentication
- Storage operations

## 🚀 Production Deployment

### Security Checklist
- [ ] Change default MinIO credentials
- [ ] Enable HTTPS for MinIO (set `MINIO_SECURE=true`)
- [ ] Configure proper CORS origins
- [ ] Set up CDN for file delivery
- [ ] Implement rate limiting
- [ ] Configure file retention policies
- [ ] Set up monitoring and alerting

### Scaling Considerations
- Use dedicated MinIO cluster for high availability
- Implement CDN for global file delivery
- Consider file deduplication based on hash
- Set up automated backups
- Monitor storage usage and costs

## 📋 Troubleshooting

### Common Issues

**1. Import Errors**
```bash
# Install system dependencies
sudo apt-get install libmagic1
pip install python-magic
```

**2. MinIO Connection Issues**
```bash
# Check MinIO container
docker ps | grep minio
docker logs startup_connect_minio
```

**3. Large File Uploads**
```python
# Increase upload limits in FastAPI
app = FastAPI()
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)
```

### Logging
```python
import logging

# Configure upload logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("upload_service")

# Add to upload functions
logger.info(f"Uploading file: {filename}, size: {size}")
```

## 🤝 Contributing

1. Follow FastAPI conventions
2. Add type hints to all functions
3. Write comprehensive tests
4. Update documentation
5. Ensure security best practices

## 📄 License

This upload system is part of the StartupConnect platform and follows the project's licensing terms. 