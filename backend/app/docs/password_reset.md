# Password Reset Functionality

This document describes the implementation of the forgot password and reset password functionality in the StartupConnect backend.

## Overview

The password reset functionality consists of two main endpoints:
1. **Forgot Password** - Initiates password reset process
2. **Reset Password** - Completes password reset with token

## API Endpoints

### 1. Forgot Password
**Endpoint:** `POST /api/v1/users/forgot-password`

**Description:** Initiates the password reset process by sending a reset token to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account with this email exists, a password reset link has been sent."
}
```

**Status Codes:**
- `200 OK` - Request processed (regardless of email existence for security)
- `400 Bad Request` - Inactive user
- `422 Unprocessable Entity` - Invalid email format

### 2. Reset Password
**Endpoint:** `POST /api/v1/users/reset-password`

**Description:** Resets the user's password using a valid reset token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "new_password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password has been reset successfully"
}
```

**Status Codes:**
- `200 OK` - Password reset successful
- `400 Bad Request` - Invalid/expired token or inactive user
- `404 Not Found` - User not found
- `422 Unprocessable Entity` - Invalid password format

## Implementation Details

### Database Changes
The `User` model has been extended with two new fields:
- `reset_token: Optional[str]` - Stores the password reset token
- `reset_token_expires: Optional[datetime]` - Token expiration timestamp

### Security Features
1. **JWT Tokens**: Reset tokens are JWT tokens with 1-hour expiration
2. **Token Type Validation**: Tokens include a "password_reset" type field
3. **Email Privacy**: The forgot password endpoint doesn't reveal if an email exists
4. **Token Cleanup**: Reset tokens are cleared after successful password reset

### Email System
- For development: Emails are logged to console
- For production: Can be integrated with services like SendGrid, AWS SES, etc.

## Files Modified/Created

### Models
- `models/user.py` - Added password reset fields and Pydantic models

### Security
- `core/security.py` - Added token generation and verification functions

### Email
- `core/email.py` - Email sending functionality (development mode)

### CRUD Operations
- `crud/user.py` - Added password reset database operations

### API Endpoints
- `api/endpoints/users.py` - Added forgot password and reset password routes

### Database Migration
- `migrations/versions/add_password_reset_fields.py` - Database schema update

## Usage Examples

### Request Password Reset
```bash
curl -X POST "http://localhost:8000/api/v1/users/forgot-password" \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com"}'
```

### Reset Password
```bash
curl -X POST "http://localhost:8000/api/v1/users/reset-password" \
     -H "Content-Type: application/json" \
     -d '{"token": "your_reset_token_here", "new_password": "newpassword123"}'
```

## Testing

Run the test script to verify functionality:
```bash
python test_password_reset.py
```

## Security Considerations

1. **Token Expiration**: Reset tokens expire after 1 hour
2. **Single Use**: Tokens are cleared after use
3. **No Email Enumeration**: Forgot password doesn't reveal email existence
4. **Secure Token Generation**: Uses cryptographically secure random tokens
5. **Password Validation**: Enforces minimum password requirements (8-40 characters)

## Production Setup

For production deployment:

1. **Configure Email Service**: Replace the email simulation with a real email service
2. **Environment Variables**: Add email service credentials to environment
3. **Frontend Integration**: Update reset URLs to point to your frontend
4. **Rate Limiting**: Implement rate limiting for password reset requests
5. **Monitoring**: Add logging and monitoring for security events

## Error Handling

The implementation includes comprehensive error handling:
- Invalid tokens are rejected with appropriate messages
- Inactive users cannot reset passwords
- Database errors are handled gracefully
- Security-first approach with minimal information disclosure 