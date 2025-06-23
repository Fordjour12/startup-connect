import asyncio
import logging

from sqlalchemy import Engine
from sqlmodel import Session, select
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.core.config import settings
from app.core.db import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 3  # 3mins
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def init_db(db_engine: Engine) -> None:
    try:
        with Session(db_engine) as session:
            session.exec(select(1))
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def init_storage() -> None:
    """Test storage server connectivity"""
    try:
        # Only test storage if MinIO is configured
        if not all(
            [
                settings.MINIO_ENDPOINT,
                settings.MINIO_ACCESS_KEY,
                settings.MINIO_SECRET_KEY,
            ]
        ):
            logger.warning("Storage not configured - skipping storage initialization")
            return

        # Import here to avoid circular imports and ensure settings are loaded
        from app.core.upload import MinIOClient

        minio_client = MinIOClient()

        # Test connection by trying to check if bucket exists
        await minio_client.ensure_bucket_exists()

        logger.info(
            f"Storage server connected successfully - Bucket: {minio_client.bucket_name}"
        )

    except Exception as e:
        logger.error(f"Storage server connection failed: {e}")
        raise


async def main() -> None:
    logger.info("Starting backend Service")

    # Test database connection
    if engine:
        init_db(engine)
        logger.info("Database connection verified")
    else:
        logger.warning("Database not configured - skipping database initialization")

    # Test storage connection
    try:
        await init_storage()
    except Exception as e:
        logger.error(f"Storage initialization failed: {e}")
        # Don't raise here - storage might be optional for some deployments
        logger.warning("Continuing without storage - some features may not work")

    logger.info("Backend Service started")


if __name__ == "__main__":
    asyncio.run(main())
