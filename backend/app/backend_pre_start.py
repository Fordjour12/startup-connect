import logging

from sqlalchemy import Engine
from sqlmodel import Session, select
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

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
def init(db_engine: Engine) -> None:
    try:
        with Session(db_engine) as session:
            session.exec(select(1))
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise


def main() -> None:
    logger.info("Starting backend Service")
    if engine:
        init(engine)
        logger.info("Database connection verified")
    else:
        logger.warning("Database not configured - skipping database initialization")
    logger.info("Backend Service started")


if __name__ == "__main__":
    main()
