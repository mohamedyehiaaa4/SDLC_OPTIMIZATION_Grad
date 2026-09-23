"""The session lives in two httpOnly cookies, so browser JavaScript can never
read the tokens. Keep the names in sync with frontend/src/middleware.ts."""

from fastapi import Response

from app.auth.service import AuthTokens
from app.core.config import get_settings

ACCESS_COOKIE = "repomind_access"
REFRESH_COOKIE = "repomind_refresh"
REFRESH_MAX_AGE = 60 * 60 * 24 * 30  # 30 days


def set_session_cookies(response: Response, tokens: AuthTokens) -> None:
    secure = get_settings().cookie_secure
    response.set_cookie(
        ACCESS_COOKIE,
        tokens.access_token,
        max_age=tokens.expires_in,
        httponly=True,
        secure=secure,
        samesite="lax",
        path="/",
    )
    response.set_cookie(
        REFRESH_COOKIE,
        tokens.refresh_token,
        max_age=REFRESH_MAX_AGE,
        httponly=True,
        secure=secure,
        samesite="lax",
        path="/",
    )


def clear_session_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE, path="/")
    response.delete_cookie(REFRESH_COOKIE, path="/")
