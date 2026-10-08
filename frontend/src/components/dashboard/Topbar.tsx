"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/components/dashboard/CurrentUserProvider";
import { NAV_ITEMS, isActive } from "@/components/dashboard/nav";
import { BellIcon } from "@/components/ui/icons";
import { logOut } from "@/services/auth.service";

function pageFor(pathname: string) {
  const item = NAV_ITEMS.find((item) => isActive(pathname, item.href));
  return item ? { title: item.label, subtitle: item.subtitle } : { title: "RepoMind", subtitle: "" };
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const page = pageFor(pathname);
  const user = useCurrentUser();

  async function handleLogOut() {
    await logOut();
    router.push("/login");
  }

  const name = user?.name ?? "";
  const email = user?.email ?? "";

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-border-soft bg-bg px-7">
      <div>
        <h1 className="text-[16px] font-semibold leading-tight">{page.title}</h1>
        {page.subtitle && (
          <p className="text-[12px] leading-tight text-ink-faint">{page.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3.5">
        <button
          type="button"
          title="Notifications"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-border-soft bg-surface text-ink-dim hover:bg-surface2 hover:text-ink"
        >
          <BellIcon className="h-[18px] w-[18px]" />
        </button>
        <div className="flex items-center gap-2.5 rounded-lg border border-border-soft bg-surface py-1.5 pl-1.5 pr-3">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[12.5px] font-semibold">{name}</span>
            <span className="text-[10.5px] text-ink-faint">{email}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogOut}
          className="rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-[12.5px] text-ink-dim hover:bg-surface2 hover:text-ink"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
