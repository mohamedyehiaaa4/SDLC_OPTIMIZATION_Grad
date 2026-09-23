import type { ReactNode } from "react";

export default function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl2 border border-border-soft bg-surface p-5 ${className}`}>
      {title && <h4 className="mb-3.5 text-[14px] font-semibold">{title}</h4>}
      {children}
    </div>
  );
}
