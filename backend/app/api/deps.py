
from collections.abc import Generator
from typing import Annotated

from pydantic_core import ValidationError

import jwt
from jwt.exceptions import InvalidTokenError
from app.core.config import settings
from app.core.database import engine
from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User,TokenPayload
from sqlmodel import Session

reusable_Oauth2 = OAuth2PasswordBearer(
    tokenUrl = f"{settings.API_V1_STR}/users/login/access-token"
)

def get_db() -> Generator[Session,None,None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_Oauth2)]



def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials Validation"
        )

    user = session.get(User,token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return user



CurrentUser = Annotated[User, Depends(get_current_user)]

# def get_current_active_user(current_user: CurrentUser) -> User:
#     return current_user


# def get_current_active_superuser(current_user: CurrentUser) -> User:
#     if not current_user.is_superuser:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="The user doesn't have enough privileges"
#         )
#     return current_user
