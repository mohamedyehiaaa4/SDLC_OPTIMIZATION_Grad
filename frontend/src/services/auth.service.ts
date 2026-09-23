import { apiRequest } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

// The session is an httpOnly cookie set by the backend; nothing about the
// user is stored in the browser, so there is nothing to tamper with.

export function signUp(input: { name: string; email: string; password: string }) {
  return apiRequest<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logIn(input: { email: string; password: string }) {
  return apiRequest<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function logOut() {
  try {
    await apiRequest<null>("/auth/logout", { method: "POST" });
  } catch {
    // The cookies are cleared server-side; nothing else to do if the call fails.
  }
}

// Asks the backend who is logged in. Rejects with ApiError(401) if nobody is.
export function getCurrentUser() {
  return apiRequest<User>("/auth/me");
}
