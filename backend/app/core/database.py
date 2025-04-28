from app.core.config import settings
from sqlmodel import create_engine


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URL))


# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)
