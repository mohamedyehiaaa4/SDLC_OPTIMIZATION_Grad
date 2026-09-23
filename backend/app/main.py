from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.auth.router import router as auth_router
from app.auth.service import AuthError

# The frontend reaches this API through its /api proxy (frontend/next.config.mjs),
# so browser requests are same-origin and no CORS setup is needed.
app = FastAPI(title="RepoMind API")


@app.exception_handler(AuthError)
def handle_auth_error(_: Request, error: AuthError) -> JSONResponse:
    return JSONResponse({"detail": error.message}, status_code=error.status_code)


@app.exception_handler(RequestValidationError)
def handle_validation_error(_: Request, error: RequestValidationError) -> JSONResponse:
    """Return the first validation problem as one readable sentence."""
    message = "Please check the form and try again."
    errors = error.errors()
    if errors:
        text = str(errors[0].get("msg", "")).removeprefix("Value error, ")
        message = text or message
    return JSONResponse({"detail": message}, status_code=422)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router)
