"use client";

import { useCurrentUser } from "@/components/dashboard/CurrentUserProvider";

export default function AccountDetails() {
  const user = useCurrentUser();

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
