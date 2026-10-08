import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl2 border border-dashed border-border bg-surface px-6 py-14 text-center">
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-[#8aa2ff]">
        {icon}
      </div>
      <h4 className="text-[15px] font-semibold">{title}</h4>
      <p className="max-w-[340px] text-[13px] text-ink-faint">{description}</p>
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
}

export function EmptyInline({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-2.5 py-9 text-center text-ink-faint">
      <div className="mb-1 opacity-60">{icon}</div>
      <strong className="text-[13px] font-semibold text-ink-dim">{title}</strong>
      <span className="text-[12px]">{description}</span>
    </div>
  );
}
