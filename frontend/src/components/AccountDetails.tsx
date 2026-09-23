"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, type User } from "@/services/auth.service";

export default function AccountDetails() {
  const [user, setUser] = useState<User | null>(null);

  // If the session is gone, the Topbar sends the user back to the login page.
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <table className="w-full border-collapse text-[13px]">
      <tbody>
        <tr>
          <td className="w-[180px] border-b border-border-soft py-2.5 text-ink-faint">Name</td>
          <td className="border-b border-border-soft py-2.5">{user?.name}</td>
        </tr>
        <tr>
          <td className="py-2.5 text-ink-faint">Email</td>
          <td className="py-2.5">{user?.email}</td>
        </tr>
      </tbody>
    </table>
  );
}
