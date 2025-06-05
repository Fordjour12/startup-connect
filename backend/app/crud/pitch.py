import uuid

from sqlmodel import Session, desc, select

from app.models.pitch import (
    PitchDeck,
    PitchDeckCreate,
    PitchMessage,
    PitchMessageCreate,
    PitchStatus,
)


def create_pitch_deck(
    db: Session, pitch_deck_in: PitchDeckCreate, founder_id: uuid.UUID
) -> PitchDeck:
    """
    Create a new PitchDeck record in the database.
    """
    pitch_deck = PitchDeck.model_validate(
        pitch_deck_in, update={"founder_id": founder_id}
    )
    db.add(pitch_deck)
    db.commit()
    db.refresh(pitch_deck)
    return pitch_deck


def create_pitch_message(
    db: Session, pitch_message_in: PitchMessageCreate, founder_id: uuid.UUID
) -> PitchMessage:
    """
    Create a new PitchMessage record in the database.
    """
    pitch_message = PitchMessage.model_validate(
        pitch_message_in, update={"founder_id": founder_id}
    )
    db.add(pitch_message)
    db.commit()
    db.refresh(pitch_message)
    return pitch_message


def get_pitch_history_by_founder(
    db: Session, founder_id: uuid.UUID
) -> list[PitchMessage]:
    """
    Get all pitch messages sent by a specific founder, ordered by creation date (newest first).
    """
    statement = (
        select(PitchMessage)
        .where(PitchMessage.founder_id == founder_id)
        .order_by(desc(PitchMessage.sent_at))
    )
    return list(db.exec(statement).all())


def get_received_pitches_by_investor(
    db: Session, investor_id: uuid.UUID
) -> list[PitchMessage]:
    """
    Get all pitch messages received by a specific investor, ordered by received date (newest first).
    """
    statement = (
        select(PitchMessage)
        .where(PitchMessage.investor_id == investor_id)
        .order_by(desc(PitchMessage.sent_at))
    )
    return list(db.exec(statement).all())


def update_pitch_status(
    db: Session, pitch_id: uuid.UUID, new_status: PitchStatus, investor_id: uuid.UUID
) -> PitchMessage | None:
    """
    Update the status of a pitch message. Only the investor who received the pitch can update it.
    """
    statement = select(PitchMessage).where(
        PitchMessage.id == pitch_id, PitchMessage.investor_id == investor_id
    )
    pitch_message = db.exec(statement).first()

    if not pitch_message:
        return None

    pitch_message.status = new_status
    db.add(pitch_message)
    db.commit()
    db.refresh(pitch_message)
    return pitch_message
