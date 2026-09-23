import BrandMark from "@/components/BrandMark";

export default function Footer() {
  return (
    <footer className="border-t border-border-soft">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <div>
            <p className="text-[13px] font-semibold">RepoMind</p>
            <p className="text-[11.5px] text-ink-faint">
              An AI assistant across the software development lifecycle
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[12.5px] text-ink-faint">
          <span>Ain Shams University · Faculty of Engineering</span>
          <span>Computer Engineering &amp; Software Systems</span>
        </div>

        <p className="text-[12px] text-ink-faint">
          © {new Date().getFullYear()} RepoMind. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
