import enum
import uuid
from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class PitchStatus(str, enum.Enum):
    SENT = "sent"
    VIEWED = "viewed"
    RESPONDED = "responded"
    ARCHIVED = "archived"


# Represents a single pitch deck file uploaded by a founder.
class PitchDeckBase(SQLModel):
    file_id: str = Field(
        description="The ID or key of the file from the upload service."
    )
    filename: str
    file_url: str
    thumbnail_url: Optional[str] = None
    file_size: int = Field(description="Size of the file in bytes.")


class PitchDeck(PitchDeckBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Foreign key to the founder (User) who uploaded it
    founder_id: uuid.UUID = Field(foreign_key="user.id")

    # Relationship to the User who is the founder
    founder: "User" = Relationship(back_populates="pitch_decks")  # type: ignore # noqa: F821

    # Relationship to all messages that use this deck
    messages: List["PitchMessage"] = Relationship(back_populates="pitch_deck")


# Represents a single pitch message sent from a founder to an investor.
class PitchMessageBase(SQLModel):
    message_content: str
    status: PitchStatus = Field(default=PitchStatus.SENT)


class PitchMessage(PitchMessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    sent_at: datetime = Field(default_factory=datetime.utcnow)

    # Foreign key to the founder (User) who sent it
    founder_id: uuid.UUID = Field(foreign_key="user.id")

    # Foreign key to the investor (User) who received it
    investor_id: uuid.UUID = Field(foreign_key="user.id")

    # Foreign key to the PitchDeck used in the message
    pitch_deck_id: uuid.UUID = Field(foreign_key="pitchdeck.id")

    # Relationship to User (sender)
    sender: "User" = Relationship(
        back_populates="sent_pitches",
        sa_relationship_kwargs={"foreign_keys": "[PitchMessage.founder_id]"},
    )  # type: ignore # noqa: F821

    # Relationship to User (recipient)
    recipient: "User" = Relationship(
        back_populates="received_pitches",
        sa_relationship_kwargs={"foreign_keys": "[PitchMessage.investor_id]"},
    )  # type: ignore # noqa: F821

    # Relationship to PitchDeck
    pitch_deck: PitchDeck = Relationship(back_populates="messages")


# Schemas for API interactions
class PitchMessageCreate(SQLModel):
    investor_id: uuid.UUID
    pitch_deck_id: uuid.UUID
    message_content: str


class PitchMessageRead(PitchMessageBase):
    id: uuid.UUID
    sent_at: datetime
    founder_id: uuid.UUID
    investor_id: uuid.UUID
    pitch_deck: "PitchDeckRead"  # type: ignore # noqa: F821


class PitchDeckCreate(PitchDeckBase):
    pass


class PitchDeckRead(PitchDeckBase):
    id: uuid.UUID
    created_at: datetime
    founder_id: uuid.UUID


class PitchStatusUpdate(SQLModel):
    status: PitchStatus
