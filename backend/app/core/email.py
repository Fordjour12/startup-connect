import logging
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


def validate_smtp_config() -> dict:
    """
    Validate SMTP configuration and return connection details.

    Returns:
        dict: Configuration status and recommendations
    """
    config_status = {
        "is_configured": False,
        "connection_type": "simulation",
        "security_level": "none",
        "recommendations": [],
    }

    # Check if basic SMTP settings are provided
    if not all([settings.SMTP_HOST, settings.SMTP_USERNAME, settings.SMTP_PASSWORD]):
        config_status["recommendations"].append(
            "SMTP credentials not configured - using simulation mode"
        )
        return config_status

    config_status["is_configured"] = True

    # Determine connection type based on port and SSL/TLS settings
    if settings.SMTP_USE_SSL:
        config_status["connection_type"] = "SSL"
        config_status["security_level"] = "high"
        if settings.SMTP_PORT != 465:
            config_status["recommendations"].append(
                f"SSL usually uses port 465, but configured port is {settings.SMTP_PORT}"
            )
    elif settings.SMTP_USE_TLS:
        config_status["connection_type"] = "STARTTLS"
        config_status["security_level"] = "high"
        if settings.SMTP_PORT != 587:
            config_status["recommendations"].append(
                f"STARTTLS usually uses port 587, but configured port is {settings.SMTP_PORT}"
            )
    else:
        config_status["connection_type"] = "plain"
        config_status["security_level"] = "low"
        config_status["recommendations"].append(
            "No encryption configured - only use in development!"
        )
        if settings.SMTP_PORT != 25:
            config_status["recommendations"].append(
                f"Plain SMTP usually uses port 25, but configured port is {settings.SMTP_PORT}"
            )

    # Environment-specific recommendations
    if (
        settings.ENVIRONMENT == "production"
        and config_status["security_level"] == "low"
    ):
        config_status["recommendations"].append(
            "CRITICAL: Production environment should use SSL or TLS encryption!"
        )

    return config_status


def send_email(
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    """
    Send email function with proper SSL/TLS handling.

    For development mode (when SMTP settings are incomplete), this will simulate email sending.
    In production, this will use proper SMTP with SSL/TLS based on configuration.

    SSL/TLS Configuration:
    - Port 587: Uses STARTTLS (SMTP_USE_TLS=True)
    - Port 465: Uses SSL from start (SMTP_USE_SSL=True)
    - Port 25: Plain SMTP (for local development only)
    """
    # Validate configuration
    config = validate_smtp_config()

    # Check if we're in development mode or missing SMTP config
    smtp_configured = config["is_configured"] and all([email_to, subject, html_content])

    if not smtp_configured or settings.ENVIRONMENT == "development":
        logger.info(
            "SMTP not fully configured or in development mode - simulating email"
        )
        logger.info(f"Configuration status: {config}")
        logger.info(f"Sending email to: {email_to}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Content: {html_content}")
        print("\n--- EMAIL SIMULATION (DEV MODE) ---")
        print(f"To: {email_to}")
        print(f"Subject: {subject}")
        print(f"Security: {config['security_level']} ({config['connection_type']})")
        print(f"Content:\n{html_content}")
        if config["recommendations"]:
            print("Recommendations:")
            for rec in config["recommendations"]:
                print(f"  - {rec}")
        print("--- END EMAIL SIMULATION ---\n")
        return

    # Log configuration warnings
    if config["recommendations"]:
        for rec in config["recommendations"]:
            logger.warning(rec)

    # Prepare email message
    msg = MIMEMultipart()
    msg["From"] = settings.SMTP_USERNAME
    msg["To"] = email_to
    msg["Subject"] = subject
    msg.attach(MIMEText(html_content, "html"))

    try:
        # Choose connection method based on configuration
        if settings.SMTP_USE_SSL:
            # Use SSL from the start (typically port 465)
            logger.info(
                f"Connecting to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT} using SSL"
            )
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT)
        else:
            # Use plain SMTP connection
            logger.info(
                f"Connecting to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT}"
            )
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)

            # Upgrade to TLS if configured (typically port 587)
            if settings.SMTP_USE_TLS:
                logger.info("Upgrading connection to TLS using STARTTLS")
                server.starttls()
            else:
                logger.warning(
                    "Sending email without encryption - only use in development!"
                )

        # Authenticate and send
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USERNAME, email_to, msg.as_string())
        server.quit()

        logger.info(
            f"Email sent successfully to {email_to} using {config['connection_type']}"
        )

    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        raise


def send_reset_password_email(email_to: str, reset_token: str) -> None:
    """Send password reset email with reset token."""
    subject = "Password Reset Request - StartupConnect"

    # In a real application, this would be the frontend URL
    reset_url = f"http://localhost:5173/reset-password?token={reset_token}"

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


def send_email_verification_email(email_to: str, verification_token: str) -> None:
    """Send email verification email with verification token."""
    subject = "Verify Your Email - StartupConnect"

    # In a real application, this would be the frontend URL
    verification_url = f"http://localhost:3000/verify-email?token={verification_token}"

    html_content = f"""
    <html>
        <body>
            <h2>Welcome to StartupConnect!</h2>
            <p>Hello,</p>
            <p>Thank you for signing up for StartupConnect. To complete your registration, please verify your email address.</p>
            <p>Click the link below to verify your email:</p>
            <p><a href="{verification_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>Or copy and paste this URL in your browser:</p>
            <p>{verification_url}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not create an account, please ignore this email.</p>
            <br>
            <p>Best regards,</p>
            <p>StartupConnect Team</p>
        </body>
    </html>
    """

    send_email(email_to=email_to, subject=subject, html_content=html_content)


def send_welcome_email(email_to: str, user_name: Optional[str] = None) -> None:
    """Send welcome email after successful email verification."""
    subject = "Welcome to StartupConnect!"

    greeting = f"Hello {user_name}," if user_name else "Hello,"

    html_content = f"""
    <html>
        <body>
            <h2>Welcome to StartupConnect!</h2>
            <p>{greeting}</p>
            <p>Your email has been successfully verified and your account is now active.</p>
            <p>StartupConnect is your gateway to connecting with innovative startups and talented professionals.</p>

            <h3>What's next?</h3>
            <ul>
                <li>Complete your profile to showcase your skills and experience</li>
                <li>Browse available startup opportunities</li>
                <li>Connect with other professionals in your field</li>
                <li>Join startup projects that match your interests</li>
            </ul>

            <p><a href="http://localhost:3000/dashboard" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a></p>

            <p>If you have any questions, feel free to reach out to our support team.</p>
            <br>
            <p>Best regards,</p>
            <p>StartupConnect Team</p>
        </body>
    </html>
    """

    send_email(email_to=email_to, subject=subject, html_content=html_content)


def send_account_locked_email(email_to: str, unlock_url: Optional[str] = None) -> None:
    """Send email notification when account is locked due to security reasons."""
    subject = "Account Security Alert - StartupConnect"

    unlock_section = ""
    if unlock_url:
        unlock_section = f"""
        <p>To unlock your account, click the link below:</p>
        <p><a href="{unlock_url}">Unlock Account</a></p>
        """

    html_content = f"""
    <html>
        <body>
            <h2>Account Security Alert</h2>
            <p>Hello,</p>
            <p>Your StartupConnect account has been temporarily locked due to multiple failed login attempts.</p>
            <p>This is a security measure to protect your account from unauthorized access.</p>

            {unlock_section}

            <p>If you did not attempt to log in, please change your password immediately and contact our support team.</p>

            <h3>Security Tips:</h3>
            <ul>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
                <li>Never share your login credentials</li>
            </ul>

            <br>
            <p>Best regards,</p>
            <p>StartupConnect Team</p>
        </body>
    </html>
    """

    send_email(email_to=email_to, subject=subject, html_content=html_content)


def send_password_changed_email(email_to: str) -> None:
    """Send confirmation email when password is successfully changed."""
    subject = "Password Changed Successfully - StartupConnect"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

    html_content = f"""
    <html>
        <body>
            <h2>Password Changed Successfully</h2>
            <p>Hello,</p>
            <p>Your password for StartupConnect has been successfully changed.</p>
            <p>If you made this change, no further action is required.</p>
            <p>If you did not change your password, please contact our support team immediately and secure your account.</p>

            <h3>Account Security:</h3>
            <ul>
                <li>Log out of all devices if you suspect unauthorized access</li>
                <li>Review your recent account activity</li>
                <li>Consider enabling additional security measures</li>
            </ul>

            <p>Timestamp: {timestamp}</p>

            <br>
            <p>Best regards,</p>
            <p>StartupConnect Team</p>
        </body>
    </html>
    """

    send_email(email_to=email_to, subject=subject, html_content=html_content)


def send_notification_email(
    email_to: str,
    subject: str,
    message: str,
    action_url: Optional[str] = None,
    action_text: Optional[str] = None,
) -> None:
    """Send a generic notification email with optional action button."""

    action_section = ""
    if action_url and action_text:
        action_section = f"""
        <p><a href="{action_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">{action_text}</a></p>
        """

    html_content = f"""
    <html>
        <body>
            <h2>{subject}</h2>
            <p>Hello,</p>
            <p>{message}</p>

            {action_section}

            <br>
            <p>Best regards,</p>
            <p>StartupConnect Team</p>
        </body>
    </html>
    """

    send_email(email_to=email_to, subject=subject, html_content=html_content)
