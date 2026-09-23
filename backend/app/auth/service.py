"""Sign up, log in, refresh and verify sessions. Credentials are stored by
Supabase Auth (auth.users, password hashed); the database trigger copies name
and email to public.users."""

from dataclasses import dataclass

from supabase_auth.errors import AuthApiError
from supabase_auth.types import User

from app.auth.schemas import UserOut
from app.core.supabase import create_supabase


class AuthError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


@dataclass
class AuthTokens:
    access_token: str
    refresh_token: str
    expires_in: int  # seconds until the access token expires


def _to_user_out(user: User) -> UserOut:
    name = (user.user_metadata or {}).get("name") or user.email or "User"
    return UserOut(id=user.id, name=name, email=user.email or "")


def _signup_error(error: AuthApiError) -> AuthError:
    code = getattr(error, "code", None)
    message = (error.message or "").lower()
    if code in ("user_already_exists", "email_exists") or "already registered" in message:
        return AuthError("An account with this email already exists.", 409)
    if code == "over_email_send_rate_limit" or "rate limit" in message:
        return AuthError(
            "Too many confirmation emails were sent. Please wait a while and try again.",
            429,
        )
    if code == "weak_password":
        return AuthError("This password is too weak. Please choose a stronger one.", 422)
    return AuthError(error.message or "Could not create the account.")


def sign_up(name: str, email: str, password: str) -> UserOut:
    client = create_supabase()
    try:
        result = client.auth.sign_up(
            {"email": email, "password": password, "options": {"data": {"name": name}}}
        )
    except AuthApiError as error:
        raise _signup_error(error) from error

    # With "Confirm email" on, Supabase hides existing accounts by returning a
    # user with no identities instead of an error.
    if result.user is None or result.user.identities == []:
        raise AuthError("An account with this email already exists.", 409)
    return _to_user_out(result.user)


def _tokens_from(session) -> AuthTokens:
    return AuthTokens(
        access_token=session.access_token,
        refresh_token=session.refresh_token,
        expires_in=int(session.expires_in or 3600),
    )


def log_in(email: str, password: str) -> tuple[UserOut, AuthTokens]:
    client = create_supabase()
    try:
        result = client.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
    except AuthApiError as error:
        code = getattr(error, "code", None)
        if code == "email_not_confirmed":
            raise AuthError("Please confirm your email before logging in.", 403) from error
        if code == "over_request_rate_limit":
            raise AuthError("Too many attempts. Please wait a moment and try again.", 429) from error
        raise AuthError("Incorrect email or password.", 401) from error
    if result.user is None or result.session is None:
        raise AuthError("Incorrect email or password.", 401)
    return _to_user_out(result.user), _tokens_from(result.session)


def get_user_from_token(access_token: str) -> UserOut:
    """Ask Supabase to validate the access token and return its user."""
    client = create_supabase()
    try:
        result = client.auth.get_user(access_token)
    except AuthApiError as error:
        raise AuthError("Your session has expired. Please log in again.", 401) from error
    if result is None or result.user is None:
        raise AuthError("Your session has expired. Please log in again.", 401)
    return _to_user_out(result.user)


def refresh(refresh_token: str) -> tuple[UserOut, AuthTokens]:
    client = create_supabase()
    try:
        result = client.auth.refresh_session(refresh_token)
    except AuthApiError as error:
        raise AuthError("Your session has expired. Please log in again.", 401) from error
    if result.user is None or result.session is None:
        raise AuthError("Your session has expired. Please log in again.", 401)
    return _to_user_out(result.user), _tokens_from(result.session)
