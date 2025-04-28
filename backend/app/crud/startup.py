from typing import List, Optional

from sqlmodel import Session, select

from app.models.startup import Startup
from app.schemas.startup import StartupCreate, StartupUpdate


def get_startup(db: Session, startup_id: int) -> Optional[Startup]:
    return db.get(Startup, startup_id)


def get_startups(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    industry: Optional[str] = None,
    location: Optional[str] = None,
    funding_stage: Optional[str] = None,
) -> List[Startup]:
    statement = select(Startup)

    if industry:
        statement = statement.where(Startup.industry == industry)
    if location:
        statement = statement.where(Startup.location == location)
    if funding_stage:
        statement = statement.where(Startup.funding_stage == funding_stage)

    statement = statement.offset(skip).limit(limit)
    return db.exec(statement).all()


def create_startup(db: Session, startup: StartupCreate) -> Startup:
    db_startup = Startup(**startup.model_dump())
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup


def update_startup(
    db: Session, startup_id: int, startup: StartupUpdate
) -> Optional[Startup]:
    db_startup = get_startup(db, startup_id)
    if not db_startup:
        return None

    update_data = startup.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_startup, field, value)

    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup


def delete_startup(db: Session, startup_id: int) -> bool:
    db_startup = get_startup(db, startup_id)
    if not db_startup:
        return False

    db.delete(db_startup)
    db.commit()
    return True


def get_startup_by_founder(db: Session, founder_id: int) -> Optional[Startup]:
    statement = select(Startup).where(Startup.founder_id == founder_id)
    return db.exec(statement).first()


def get_startups_by_founder(db: Session, founder_id: int) -> List[Startup]:
    statement = select(Startup).where(Startup.founder_id == founder_id)
    return db.exec(statement).all()


def get_startups_by_industry(db: Session, industry: str) -> List[Startup]:
    statement = select(Startup).where(Startup.industry == industry)
    return db.exec(statement).all()


def get_startups_by_location(db: Session, location: str) -> List[Startup]:
    statement = select(Startup).where(Startup.location == location)
    return db.exec(statement).all()


def get_startups_by_funding_stage(db: Session, funding_stage: str) -> List[Startup]:
    statement = select(Startup).where(Startup.funding_stage == funding_stage)
    return db.exec(statement).all()


def get_startups_by_funding_amount(db: Session, funding_amount: float) -> List[Startup]:
    return db.query(Startup).filter(Startup.funding_amount == funding_amount).all()


def get_startups_by_funding_amount_range(
    db: Session, min_funding: float, max_funding: float
) -> List[Startup]:
    statement = select(Startup).where(
        Startup.funding_goal >= min_funding, Startup.funding_goal <= max_funding
    )
    return db.exec(statement).all()
