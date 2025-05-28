import uuid
from typing import Optional, Sequence

from sqlmodel import Session, select

from app.models.startup import Startup, StartupCreate, StartupUpdate

"""
    Get a startup by id 
    @param db: Session
    @param startup_id: int
    @return Optional[Startup]   
"""


def get_startup(db: Session, startup_id: uuid.UUID) -> Optional[Startup]:
    return db.get(Startup, startup_id)


"""
    Get all startups
    @param db: Session
    @param skip: int
    @param limit: int
    @param industry: Optional[str]
    @param location: Optional[str]
    @param funding_stage: Optional[str]
    @return Sequence[Startup]
"""


def get_startups(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    industry: Optional[str] = None,
    location: Optional[str] = None,
    funding_stage: Optional[str] = None,
) -> Sequence[Startup]:
    statement = select(Startup)

    if industry:
        statement = statement.where(Startup.industry == industry)
    if location:
        statement = statement.where(Startup.location == location)
    if funding_stage:
        statement = statement.where(Startup.funding_stage == funding_stage)

    statement = statement.offset(skip).limit(limit)
    results = db.exec(statement).all()
    return results


"""
    Create a startup
    @param db: Session
    @param startup: StartupCreate
    @return Startup
"""


def create_startup(
    db: Session, startup: StartupCreate, founder_id: uuid.UUID
) -> Startup:
    startup_data = startup.model_dump()
    startup_data["founder_id"] = founder_id
    db_startup = Startup(**startup_data)
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup


"""
    Update a startup
    @param db: Session
    @param startup_id: uuid.UUID
    @param startup: StartupUpdate
    @return Optional[Startup]
"""


def update_startup(
    db: Session, startup_id: uuid.UUID, startup: StartupUpdate
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


"""
    Delete a startup
    @param db: Session
    @param startup_id: uuid.UUID
    @return bool
"""


def delete_startup(db: Session, startup_id: uuid.UUID) -> bool:
    db_startup = get_startup(db, startup_id)
    if not db_startup:
        return False

    db.delete(db_startup)
    db.commit()
    return True


"""
    Get a startup by founder id
    @param db: Session
    @param founder_id: uuid.UUID
    @return Optional[Startup]
"""


def get_startup_by_founder(db: Session, founder_id: uuid.UUID) -> Optional[Startup]:
    statement = select(Startup).where(Startup.founder_id == founder_id)
    result = db.exec(statement).first()
    return result


"""
    Get all startups by founder id
    @param db: Session
    @param founder_id: uuid.UUID
    @return Sequence[Startup]
"""


def get_startups_by_founder(db: Session, founder_id: uuid.UUID) -> Sequence[Startup]:
    statement = select(Startup).where(Startup.founder_id == founder_id)
    results = db.exec(statement).all()
    return results


"""
    Get all startups by industry
    @param db: Session
    @param industry: str
    @return Sequence[Startup]
"""


def get_startups_by_industry(db: Session, industry: str) -> Sequence[Startup]:
    statement = select(Startup).where(Startup.industry == industry)
    results = db.exec(statement).all()
    return results


"""
    Get all startups by location
    @param db: Session
    @param location: str
    @return Sequence[Startup]
"""


def get_startups_by_location(db: Session, location: str) -> Sequence[Startup]:
    statement = select(Startup).where(Startup.location == location)
    results = db.exec(statement).all()
    return results


"""
    Get all startups by funding stage
    @param db: Session
    @param funding_stage: str
    @return Sequence[Startup]
"""


def get_startups_by_funding_stage(db: Session, funding_stage: str) -> Sequence[Startup]:
    statement = select(Startup).where(Startup.funding_stage == funding_stage)
    results = db.exec(statement).all()
    return results


""" 
def get_startups_by_funding_amount(db: Session, funding_amount: float) -> Sequence[Startup]:
    statement = select(Startup).where(
        Startup.funding_goal >= funding_amount,
        Startup.funding_goal <= funding_amount + 1000000,
    )
    results = db.exec(statement).all()
    return results


def get_startups_by_funding_amount_range(
    db: Session, min_funding: float, max_funding: float
) -> Sequence[Startup]:
    statement = select(Startup).where(
        Startup.funding_goal >= min_funding, Startup.funding_goal <= max_funding
    )
    results = db.exec(statement).all()
    return results


def get_startups_by_funding_goal_range(
    db: Session, min_funding: float, max_funding: float
) -> Sequence[Startup]:
    statement = select(Startup).where(
        Startup.funding_goal >= min_funding, Startup.funding_goal <= max_funding
    )
    results = db.exec(statement).all()
    return results


"""
