"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import BrandMark from "@/components/ui/BrandMark";
import { NAV_ITEMS, isActive } from "@/components/dashboard/nav";

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
          {NAV_ITEMS.filter((item) => item.group === "top").map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={isActive(pathname, item.href)}
            />
          ))}
        </div>

        <div className="mt-2.5 flex flex-col gap-0.5 border-t border-border-soft pt-2.5">
          {NAV_ITEMS.filter((item) => item.group === "bottom").map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={isActive(pathname, item.href)}
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
