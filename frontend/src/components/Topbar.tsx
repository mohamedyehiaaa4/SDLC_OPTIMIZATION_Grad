"use client";

import { usePathname } from "next/navigation";
import { BellIcon } from "@/components/icons";

const PAGES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Home",
    subtitle: "Overview of your workspace and projects",
  },
  "/dashboard/requirements": {
    title: "Requirements",
    subtitle: "Product requirements, user stories, and sprint planning",
  },
  "/dashboard/design": {
    title: "Design",
    subtitle: "System architecture and design decisions",
  },
  "/dashboard/implementation": {
    title: "Implementation",
    subtitle: "User stories, commits, and pull requests",
  },
  "/dashboard/testing": {
    title: "Testing",
    subtitle: "Test runs, coverage, and quality trends",
  },
  "/dashboard/projects": {
    title: "Projects",
    subtitle: "All projects connected to your workspace",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Account and integration preferences",
  },
};

function pageFor(pathname: string) {
  if (PAGES[pathname]) return PAGES[pathname];
  const match = Object.keys(PAGES).find(
    (key) => key !== "/dashboard" && pathname.startsWith(key)
  );
  return match ? PAGES[match] : { title: "RepoMind", subtitle: "" };
}

export default function Topbar() {
  const pathname = usePathname();
  const page = pageFor(pathname);

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
            M
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[12.5px] font-semibold">Mohamed Yehia</span>
            <span className="text-[10.5px] text-ink-faint">Workspace Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
