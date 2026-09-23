import type { ReactNode } from "react";

type Tone = "blue" | "amber" | "green" | "purple";

const toneClasses: Record<Tone, string> = {
  blue: "bg-accent-soft text-accent",
  amber: "bg-warn-soft text-warn",
  green: "bg-good-soft text-good",
  purple: "bg-[rgba(169,137,90,0.14)] text-accentSecondary",
};

export default function StatCard({
  label,
  value,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl2 border border-border-soft bg-surface px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-ink-faint">{label}</span>
        <div
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${toneClasses[tone]}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-[24px] font-bold">{value}</div>
    </div>
  );
}
