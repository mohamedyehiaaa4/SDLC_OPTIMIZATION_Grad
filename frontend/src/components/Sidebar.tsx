"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import BrandMark from "@/components/BrandMark";
import {
  CodeIcon,
  DesignIcon,
  DocIcon,
  FolderIcon,
  HomeIcon,
  SettingsIcon,
  TestingIcon,
} from "@/components/icons";

const topNavItems = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/requirements", label: "Requirements", icon: DocIcon },
  { href: "/dashboard/design", label: "Design", icon: DesignIcon },
  { href: "/dashboard/implementation", label: "Implementation", icon: CodeIcon },
  { href: "/dashboard/testing", label: "Testing", icon: TestingIcon },
];

const bottomNavItems = [
  { href: "/dashboard/projects", label: "Projects", icon: FolderIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

function NavLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
        active
          ? "bg-accent-soft text-[#c7d2ff]"
          : "text-ink-dim hover:bg-surface2 hover:text-ink"
      }`}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${active ? "opacity-100" : "opacity-85"}`}
      />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-border-soft bg-surface p-3.5">
      <div className="flex items-center gap-2.5 px-2 pb-[22px] pt-1">
        <BrandMark size={32} />
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight">RepoMind</span>
          <span className="text-[10.5px] text-ink-faint">
            AI Assistant for the SDLC
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-0.5">
          {topNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={isActive(item.href)}
            />
          ))}
        </div>

        <div className="mt-2.5 flex flex-col gap-0.5 border-t border-border-soft pt-2.5">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={isActive(item.href)}
            />
          ))}
          <Link
            href="/"
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-[12.5px] text-ink-faint transition-colors hover:bg-surface2 hover:text-ink-dim"
          >
            <span>← Back to website</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
