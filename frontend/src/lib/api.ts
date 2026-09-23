// Browser-side helper for calling the RepoMind backend.
// Requests go to /api/*, which next.config.mjs proxies to the FastAPI server.
// The session lives in httpOnly cookies the browser sends automatically.

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

// A 401 on these paths is a real answer (wrong password, no session), so we
// must not try to refresh the session and retry.
const NO_REFRESH_PATHS = ["/auth/login", "/auth/signup", "/auth/refresh", "/auth/logout"];

function send(path: string, init: RequestInit) {
  return fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
}

// Several requests can hit 401 together; share one refresh call between them.
let refreshing: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response = await send(path, init);

  if (response.status === 401 && !NO_REFRESH_PATHS.includes(path) && (await refreshSession())) {
    response = await send(path, init);
  }

  const body = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    // The backend returns one readable sentence in `detail`
    const detail = body?.detail;
    const message = typeof detail === "string" ? detail : "Please check the form and try again.";
    throw new ApiError(message, response.status);
  }
  return body as T;
}
