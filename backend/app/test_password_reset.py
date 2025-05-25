"""
Test script to demonstrate password reset functionality.
This is a simple demonstration - in production you'd use proper testing frameworks.
"""

from app.core.security import create_password_reset_token, verify_password_reset_token
from app.core.email import send_reset_password_email


def test_password_reset_token():
    """Test password reset token generation and verification."""
    print("=== Testing Password Reset Token ===")

    # Test email
    test_email = "test@example.com"

    # Generate token
    print(f"Generating reset token for: {test_email}")
    token = create_password_reset_token(test_email)
    print(f"Generated token: {token[:50]}...")

    # Verify token immediately
    verified_email = verify_password_reset_token(token)
    print(f"Verified email: {verified_email}")

    if verified_email == test_email:
        print("✅ Token verification successful!")
    else:
        print("❌ Token verification failed!")

    print()


def test_email_sending():
    """Test email sending functionality."""
    print("=== Testing Email Sending ===")

    test_email = "user@startup.com"
    test_token = "example_reset_token_123"

    print(f"Sending password reset email to: {test_email}")
    send_reset_password_email(test_email, test_token)
    print("✅ Email sending test completed!")
    print()


def test_invalid_token():
    """Test invalid token handling."""
    print("=== Testing Invalid Token ===")

    invalid_token = "invalid.token.here"
    result = verify_password_reset_token(invalid_token)

    if result is None:
        print("✅ Invalid token correctly rejected!")
    else:
        print("❌ Invalid token was accepted!")

    print()


if __name__ == "__main__":
    print("Password Reset Functionality Tests")
    print("=" * 40)

    test_password_reset_token()
    test_email_sending()
    test_invalid_token()

    print("=" * 40)
    print("All tests completed!")
    print("\nAPI Endpoints Summary:")
    print("📧 POST /api/v1/users/forgot-password - Request password reset")
    print("🔑 POST /api/v1/users/reset-password - Reset password with token")
    print("\nExample curl commands:")
    print("""
# Request password reset
curl -X POST "http://localhost:8000/api/v1/users/forgot-password" \\
     -H "Content-Type: application/json" \\
     -d '{"email": "user@example.com"}'

# Reset password
curl -X POST "http://localhost:8000/api/v1/users/reset-password" \\
     -H "Content-Type: application/json" \\
     -d '{"token": "your_reset_token_here", "new_password": "newpassword123"}'
    """)
