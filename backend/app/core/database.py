from core.config import settings
from dotenv import load_dotenv
from sqlmodel import Session, create_engine

load_dotenv()

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URL))


def get_db():
    with Session(engine) as session:
        yield session


# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)
