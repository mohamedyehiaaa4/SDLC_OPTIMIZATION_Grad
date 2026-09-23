from supabase import Client, ClientOptions, create_client

from app.core.config import get_settings


def create_supabase() -> Client:
    """Create a new Supabase client (one per request, so sessions never mix)."""
    settings = get_settings()
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key,
        options=ClientOptions(auto_refresh_token=False, persist_session=False),
    )
