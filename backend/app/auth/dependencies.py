from fastapi import Cookie

from app.auth import service
from app.auth.cookies import ACCESS_COOKIE
from app.auth.schemas import UserOut
from app.auth.service import AuthError


def get_current_user(
    access_token: str | None = Cookie(default=None, alias=ACCESS_COOKIE),
) -> UserOut:
    """Use as `Depends(get_current_user)` on every route that needs a logged-in user."""
    if not access_token:
        raise AuthError("Not authenticated.", 401)
    return service.get_user_from_token(access_token)
