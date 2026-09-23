from fastapi import APIRouter, Cookie, Depends, Response

from app.auth import service
from app.auth.cookies import (
    REFRESH_COOKIE,
    clear_session_cookies,
    set_session_cookies,
)
from app.auth.dependencies import get_current_user
from app.auth.schemas import LoginRequest, SignupRequest, UserOut
from app.auth.service import AuthError

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut, status_code=201)
def signup(body: SignupRequest) -> UserOut:
    return service.sign_up(body.name, body.email, body.password)


@router.post("/login", response_model=UserOut)
def login(body: LoginRequest, response: Response) -> UserOut:
    user, tokens = service.log_in(body.email, body.password)
    set_session_cookies(response, tokens)
    return user


@router.post("/refresh", response_model=UserOut)
def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_COOKIE),
) -> UserOut:
    if not refresh_token:
        raise AuthError("Not authenticated.", 401)
    user, tokens = service.refresh(refresh_token)
    set_session_cookies(response, tokens)
    return user


@router.post("/logout", status_code=204)
def logout() -> Response:
    response = Response(status_code=204)
    clear_session_cookies(response)
    return response


@router.get("/me", response_model=UserOut)
def me(user: UserOut = Depends(get_current_user)) -> UserOut:
    return user
