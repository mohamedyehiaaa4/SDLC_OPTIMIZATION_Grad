from fastapi import FastAPI

from app.auth.router import router as auth_router
from app.core.errors import register_error_handlers

# The frontend reaches this API through its /api proxy (frontend/next.config.mjs),
# so browser requests are same-origin and no CORS setup is needed.
app = FastAPI(title="RepoMind API")
register_error_handlers(app)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


# One router per feature package (app/<feature>/router.py).
app.include_router(auth_router)
