"""Every error the API returns is one readable sentence in `detail`, which the
frontend (src/lib/api.ts) shows as-is."""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Raise from any feature's service with a user-facing message."""

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def handle_app_error(_: Request, error: AppError) -> JSONResponse:
    return JSONResponse({"detail": error.message}, status_code=error.status_code)


def handle_validation_error(_: Request, error: RequestValidationError) -> JSONResponse:
    """Return the first validation problem as one readable sentence."""
    message = "Please check the form and try again."
    errors = error.errors()
    if errors:
        text = str(errors[0].get("msg", "")).removeprefix("Value error, ")
        message = text or message
    return JSONResponse({"detail": message}, status_code=422)


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, handle_app_error)
    app.add_exception_handler(RequestValidationError, handle_validation_error)
