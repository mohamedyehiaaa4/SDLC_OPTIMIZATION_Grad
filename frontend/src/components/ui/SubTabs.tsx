"use client";

import { useState } from "react";

export default function SubTabs({ tabs }: { tabs: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mb-4 flex gap-0.5 border-b border-border-soft">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActive(i)}
          className={`relative top-px mr-5 border-b-2 pb-2.5 pt-1 text-[13px] font-medium transition-colors ${
            i === active
              ? "border-accent text-ink"
              : "border-transparent text-ink-faint hover:text-ink-dim"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
