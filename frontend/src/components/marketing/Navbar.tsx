import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark size={32} />
          <span className="text-[15px] font-semibold tracking-tight">RepoMind</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[13.5px] text-ink-dim md:flex">
          <a href="#platform" className="hover:text-ink">Platform</a>
          <a href="#workflow" className="hover:text-ink">Workflow</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-2 text-[13.5px] font-medium text-ink-dim hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-[#5470ff]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
