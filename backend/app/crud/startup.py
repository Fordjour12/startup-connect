from sqlalchemy.orm import Session
from typing import List, Optional
from models.startup import Startup
from schemas.startup import StartupCreate, StartupUpdate

def get_startup(db: Session, startup_id: int) -> Optional[Startup]:
    return db.query(Startup).filter(Startup.id == startup_id).first()

def get_startups(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    industry: Optional[str] = None,
    location: Optional[str] = None,
    funding_stage: Optional[str] = None
) -> List[Startup]:
    query = db.query(Startup)
    
    if industry:
        query = query.filter(Startup.industry == industry)
    if location:
        query = query.filter(Startup.location == location)
    if funding_stage:
        query = query.filter(Startup.funding_stage == funding_stage)
    
    return query.offset(skip).limit(limit).all()


def create_startup(db: Session, startup: StartupCreate) -> Startup:
    db_startup = Startup(**startup.model_dump())
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup


def update_startup(db: Session, startup_id: int, startup: StartupUpdate) -> Optional[Startup]:
    db_startup = get_startup(db, startup_id)
    if db_startup:
        db_startup.update(**startup.model_dump())
        db.commit()
        db.refresh(db_startup)
    return db_startup

def delete_startup(db: Session, startup_id: int) -> bool:
    db_startup = get_startup(db, startup_id)
    if db_startup:
        db.delete(db_startup)
        db.commit()
        return True
    return False


def get_startup_by_founder(db: Session, founder_id: int) -> Optional[Startup]:
    return db.query(Startup).filter(Startup.founder_id == founder_id).first()

def get_startups_by_founder(db: Session, founder_id: int) -> List[Startup]:
    return db.query(Startup).filter(Startup.founder_id == founder_id).all()

def get_startups_by_industry(db: Session, industry: str) -> List[Startup]:
    return db.query(Startup).filter(Startup.industry == industry).all()

def get_startups_by_location(db: Session, location: str) -> List[Startup]:
    return db.query(Startup).filter(Startup.location == location).all()

def get_startups_by_funding_stage(db: Session, funding_stage: str) -> List[Startup]:
    return db.query(Startup).filter(Startup.funding_stage == funding_stage).all()

def get_startups_by_funding_amount(db: Session, funding_amount: float) -> List[Startup]:
    return db.query(Startup).filter(Startup.funding_amount == funding_amount).all()

def get_startups_by_funding_amount_range(db: Session, min_funding: float, max_funding: float) -> List[Startup]:
    return db.query(Startup).filter(Startup.funding_amount >= min_funding, Startup.funding_amount <= max_funding).all()

