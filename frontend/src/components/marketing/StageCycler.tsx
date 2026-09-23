"use client";

import { useEffect, useState } from "react";
import { CodeIcon, DesignIcon, DocIcon, TestingIcon } from "@/components/icons";

const stages = [
  {
    icon: DocIcon,
    name: "Requirements",
    note: "Drafting user stories with you",
  },
  {
    icon: DesignIcon,
    name: "Design",
    note: "Proposing architecture for review",
  },
  {
    icon: CodeIcon,
    name: "Implementation",
    note: "Generating code alongside your team",
  },
  {
    icon: TestingIcon,
    name: "Testing",
    note: "Running and explaining test results",
  },
];

export default function StageCycler() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % stages.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-center gap-2 text-[12.5px] text-ink-dim">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-good" />
        </span>
        <span>
          Assisting now:{" "}
          <span className="font-semibold text-ink">{stages[active].name}</span> — {stages[active].note}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        {stages.map(({ icon: Icon, name }, i) => {
          const isActive = i === active;
          return (
            <div
              key={name}
              className={`rounded-lg border p-4 text-left transition-all duration-500 ${
                isActive
                  ? "border-accent bg-accent-soft shadow-[0_0_0_1px_rgba(91,124,250,0.35)]"
                  : "border-border-soft bg-surface2"
              }`}
            >
              <div
                className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-500 ${
                  isActive ? "bg-accent text-white" : "bg-accent-soft text-[#8aa2ff]"
                }`}
              >
                <Icon className="h-[16px] w-[16px]" />
              </div>
              <p className="text-[13px] font-semibold">{name}</p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border-soft">
                {isActive && (
                  <div
                    key={active}
                    className="h-full rounded-full bg-accent"
                    style={{ animation: "grow-bar 2.4s linear forwards" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes grow-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
