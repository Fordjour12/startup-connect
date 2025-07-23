# Demo Video API Documentation

This document describes how to use the demo video functionality for startups in the StartupConnect backend.

## Overview

The demo video functionality allows startup founders to upload and manage demo videos for their startups. These videos can be displayed on startup profiles to showcase their products or services.

## Features

- **Video Upload**: Upload demo videos up to 100MB in size
- **Format Support**: MP4, WebM, OGG, QuickTime (.mov), and AVI formats
- **Secure Storage**: Videos are stored securely in MinIO/S3 compatible storage
- **Founder-Only Access**: Only startup founders can upload demo videos for their startups
- **URL Management**: Easy URL updates for existing startups

## API Endpoints

### 1. Upload Demo Video

**Endpoint**: `POST /api/v1/upload/startup-demo-video`

**Authentication**: Required (founder role)

**Request**: Multipart form data
```bash
curl -X POST "http://localhost:8000/api/v1/upload/startup-demo-video" \
  -H "accept: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@demo_video.mp4"
```

**Response**:
```json
{
  "file_id": "uuid-string",
  "filename": "demo_video.mp4",
  "content_type": "video/mp4",
  "size": 15728640,
  "url": "http://localhost:9000/startup-connect-files/videos/2024/06/25/uuid_demo_video.mp4",
  "thumbnail_url": null,
  "metadata": {
    "hash": "sha256-hash",
    "original_size": 15728640,
    "video_type": "startup_demo",
    "founder_id": "founder-uuid",
    "usage": "startup_profile"
  }
}
```

### 2. Generic Video Upload

**Endpoint**: `POST /api/v1/upload/video`

**Authentication**: Required

**Request**: Same as above but for general video uploads

### 3. Update Startup Demo Video

**Endpoint**: `PUT /api/v1/startups/{startup_id}/demo-video`

**Authentication**: Required (startup owner)

**Request**:
```bash
curl -X PUT "http://localhost:8000/api/v1/startups/{startup_id}/demo-video" \
  -H "accept: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "video_url_here"
```

**Response**: Returns updated startup object with new demo_video_url

## Frontend Integration

### Upload Flow

1. **File Selection**: Allow users to select video files
2. **Validation**: Check file size (max 100MB) and format
3. **Upload**: Use the `/upload/startup-demo-video` endpoint
4. **URL Update**: Use the returned URL to update the startup

### Example Frontend Code (JavaScript)

```javascript
// Upload demo video
async function uploadDemoVideo(file, authToken) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/v1/upload/startup-demo-video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('Demo video upload failed:', error);
    throw error;
  }
}

// Update startup with demo video
async function updateStartupDemoVideo(startupId, videoUrl, authToken) {
  try {
    const response = await fetch(`/api/v1/startups/${startupId}/demo-video`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(videoUrl)
    });
    
    if (!response.ok) {
      throw new Error('Update failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Demo video update failed:', error);
    throw error;
  }
}

// Complete flow: upload and update startup
async function addDemoVideoToStartup(startupId, videoFile, authToken) {
  try {
    // Step 1: Upload the video
    const videoUrl = await uploadDemoVideo(videoFile, authToken);
    
    // Step 2: Update the startup with the video URL
    const updatedStartup = await updateStartupDemoVideo(startupId, videoUrl, authToken);
    
    console.log('Demo video successfully added to startup:', updatedStartup);
    return updatedStartup;
  } catch (error) {
    console.error('Failed to add demo video to startup:', error);
    throw error;
  }
}
```

### Create Startup with Demo Video

You can also include the demo video URL when creating a new startup:

```javascript
async function createStartupWithDemoVideo(startupData, videoFile, authToken) {
  try {
    // Upload video first
    const videoUrl = await uploadDemoVideo(videoFile, authToken);
    
    // Include video URL in startup data
    const startupWithVideo = {
      ...startupData,
      demo_video_url: videoUrl
    };
    
    // Create startup
    const response = await fetch('/api/v1/startups/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(startupWithVideo)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create startup with demo video:', error);
    throw error;
  }
}
```

## Validation Rules

- **File Size**: Maximum 100MB
- **Formats**: MP4 (recommended), WebM, OGG, QuickTime (.mov), AVI
- **Authentication**: Must be logged in as a founder
- **Ownership**: Can only upload/update videos for owned startups

## Error Handling

Common error responses:

- `400 Bad Request`: Invalid file format or size
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Not authorized (not a founder or not startup owner)
- `413 Request Entity Too Large`: File size exceeds 100MB limit
- `500 Internal Server Error`: Server-side upload or processing error

## Storage Information

- Videos are stored in MinIO/S3 under the `videos/` folder
- File paths follow the pattern: `videos/YYYY/MM/DD/uuid_filename.ext`
- URLs are publicly accessible once uploaded
- Files are stored with metadata including hash, upload timestamp, and founder information

## Security Considerations

- All uploads require authentication
- File type validation using python-magic (not just extensions)
- SHA-256 hashing for file integrity
- Founder-only access control for startup demo videos
- Secure filename sanitization to prevent path traversal attacks 