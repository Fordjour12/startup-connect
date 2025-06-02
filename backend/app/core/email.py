import logging

logger = logging.getLogger(__name__)


def send_email(
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    """
    Send email function.
    For development/demo purposes, this will just log the email content.
    In production, you would integrate with an email service like SendGrid, SES, etc.
    """
    logger.info(f"Sending email to: {email_to}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Content: {html_content}")
    print("\n--- EMAIL SIMULATION ---")
    print(f"To: {email_to}")
    print(f"Subject: {subject}")
    print(f"Content:\n{html_content}")
    print("--- END EMAIL ---\n")


def send_reset_password_email(email_to: str, reset_token: str) -> None:
    """Send password reset email with reset token."""
    subject = "Password Reset Request - StartupConnect"

    # In a real application, this would be the frontend URL
    reset_url = f"http://localhost:3000/reset-password?token={reset_token}"

    html_content = f"""
    <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password for StartupConnect.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="{reset_url}">Reset Password</a></p>
            <p>Or copy and paste this URL in your browser:</p>
            <p>{reset_url}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <br>
            <p>Best regards,</p>
            <p>StartupConnect Team</p>
        </body>
    </html>
    """

    send_email(email_to=email_to, subject=subject, html_content=html_content)
