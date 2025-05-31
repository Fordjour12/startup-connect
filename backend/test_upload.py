#!/usr/bin/env python3
"""
Test script for the upload functionality.
This demonstrates how to use the upload service and test various file types.
"""

import asyncio
from pathlib import Path

import requests
from PIL import Image


# Create sample test files
def create_test_image(filename: str = "test_image.jpg") -> str:
    """Create a test image file"""
    # Create a simple test image
    image = Image.new("RGB", (800, 600), color="red")
    image.save(filename, "JPEG")
    return filename


def create_test_document(filename: str = "test_document.txt") -> str:
    """Create a test document file"""
    with open(filename, "w") as f:
        f.write("This is a test document for upload testing.\n")
        f.write("It contains sample content to verify document upload functionality.\n")
    return filename


async def test_upload_endpoints():
    """Test the upload endpoints"""
    base_url = "http://localhost:8000/api/v1/upload"

    # You'll need to get an auth token first
    # For testing, you can get this from your auth endpoint
    auth_token = "your_auth_token_here"
    headers = {"Authorization": f"Bearer {auth_token}"}

    print("🔍 Testing Upload Service...")

    # Test health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")

    # Test image upload
    try:
        test_image_path = create_test_image()
        with open(test_image_path, "rb") as f:
            files = {"file": ("test_image.jpg", f, "image/jpeg")}
            response = requests.post(f"{base_url}/image", files=files, headers=headers)
        print(f"✅ Image upload: {response.status_code}")
        if response.status_code == 201:
            result = response.json()
            print(f"   📁 File ID: {result['file_id']}")
            print(f"   🔗 URL: {result['url']}")
            print(f"   🖼️ Thumbnail: {result['thumbnail_url']}")

        # Clean up
        Path(test_image_path).unlink()

    except Exception as e:
        print(f"❌ Image upload failed: {e}")

    # Test document upload
    try:
        test_doc_path = create_test_document()
        with open(test_doc_path, "rb") as f:
            files = {"file": ("test_document.txt", f, "text/plain")}
            response = requests.post(
                f"{base_url}/document", files=files, headers=headers
            )
        print(f"✅ Document upload: {response.status_code}")
        if response.status_code == 201:
            result = response.json()
            print(f"   📁 File ID: {result['file_id']}")
            print(f"   🔗 URL: {result['url']}")

        # Clean up
        Path(test_doc_path).unlink()

    except Exception as e:
        print(f"❌ Document upload failed: {e}")


if __name__ == "__main__":
    print("📋 Upload Service Test Script")
    print("=" * 50)

    # Run async tests
    asyncio.run(test_upload_endpoints())

    print("\n🎯 Test Configuration:")
    print("- Max image size: 10MB")
    print("- Max file size: 50MB")
    print("- Supported image types: JPEG, PNG, WebP, GIF")
    print("- Supported document types: PDF, Word, PowerPoint, Text, CSV, JSON")
    print("- Automatic image optimization and thumbnails")
    print("- Secure file type validation using python-magic")
    print("- Organized storage structure by date and type")

    print("\n📖 Usage Examples:")
    print("1. Upload image: POST /api/v1/upload/image")
    print("2. Upload document: POST /api/v1/upload/document")
    print("3. Upload profile image: POST /api/v1/upload/profile-image")
    print("4. Delete file: DELETE /api/v1/upload/{file_key}")
    print("5. Health check: GET /api/v1/upload/health")
