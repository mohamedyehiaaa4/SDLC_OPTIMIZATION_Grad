"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { getCurrentUser, logOut, type User } from "@/services/auth.service";

const CurrentUserContext = createContext<User | null>(null);

// Loads the logged-in user once for the whole dashboard. If the session is gone
// (and could not be refreshed), clears the cookies and sends the user to /login.
export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(async (error) => {
        if (error instanceof ApiError && error.status === 401) {
          await logOut();
          router.replace("/login");
        }
      });
  }, [router]);

  return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
}

// The logged-in user, or null while it is still loading.
export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
