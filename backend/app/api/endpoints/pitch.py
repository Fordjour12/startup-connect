import uuid
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.api.deps import CurrentUser, SessionDep
from app.core.upload import UploadResponse, upload_service
from app.crud.pitch import (
    create_pitch_deck,
    create_pitch_message,
    get_pitch_history_by_founder,
    get_received_pitches_by_investor,
    update_pitch_status,
)
from app.models.pitch import (
    PitchDeckCreate,
    PitchMessageCreate,
    PitchMessageRead,
    PitchStatusUpdate,
)

router = APIRouter(prefix="/pitches", tags=["Pitches"])


@router.post(
    "/send/{investor_id}",
    response_model=PitchMessageRead,
    status_code=status.HTTP_201_CREATED,
)
async def send_pitch(
    investor_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    message_content: Annotated[str, Form()],
    pitch_deck_file: Annotated[UploadFile, File()],
):
    """
    Send a pitch to an investor. This involves:
    1. Uploading the pitch deck file.
    2. Creating a PitchDeck record in the database.
    3. Creating a PitchMessage record linking the founder, investor, and deck.
    """
    if current_user.role != "founder":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only founders can send pitches.",
        )

    # 1. Upload the pitch deck file
    try:
        upload_result: UploadResponse = await upload_service.upload_document(
            pitch_deck_file
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {e}",
        ) from e

    # 2. Create a PitchDeck record
    pitch_deck_in = PitchDeckCreate(
        file_id=upload_result.file_id,
        filename=upload_result.filename,
        file_url=upload_result.url,
        thumbnail_url=upload_result.thumbnail_url,
        file_size=upload_result.size,
    )
    new_deck = create_pitch_deck(
        db=session, pitch_deck_in=pitch_deck_in, founder_id=current_user.id
    )

    # 3. Create a PitchMessage record
    pitch_message_in = PitchMessageCreate(
        investor_id=investor_id,
        pitch_deck_id=new_deck.id,
        message_content=message_content,
    )
    new_message = create_pitch_message(
        db=session, pitch_message_in=pitch_message_in, founder_id=current_user.id
    )

    return new_message


@router.get("/history", response_model=list[PitchMessageRead])
async def get_pitch_history(
    session: SessionDep,
    current_user: CurrentUser,
):
    """
    Get the pitch history for the current founder.
    Returns all pitches sent by the founder, ordered by date (newest first).
    """
    if current_user.role != "founder":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only founders can view pitch history.",
        )

    pitch_history = get_pitch_history_by_founder(db=session, founder_id=current_user.id)
    return pitch_history


@router.get("/received", response_model=list[PitchMessageRead])
async def get_received_pitches(
    session: SessionDep,
    current_user: CurrentUser,
):
    """
    Get all pitches received by the current investor.
    Returns all pitches received by the investor, ordered by date (newest first).
    """
    if current_user.role != "investor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only investors can view received pitches.",
        )

    received_pitches = get_received_pitches_by_investor(
        db=session, investor_id=current_user.id
    )
    return received_pitches


@router.patch("/{pitch_id}/status", response_model=PitchMessageRead)
async def update_pitch_message_status(
    pitch_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    status_update: PitchStatusUpdate,
):
    """
    Update the status of a received pitch. Only investors can update pitch status,
    and only for pitches they have received.
    """
    if current_user.role != "investor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only investors can update pitch status.",
        )

    updated_pitch = update_pitch_status(
        db=session,
        pitch_id=pitch_id,
        new_status=status_update.status,
        investor_id=current_user.id,
    )

    if not updated_pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch not found or you don't have permission to update it.",
        )

    return updated_pitch
