type Tone = "gray" | "green";

const toneClasses: Record<Tone, string> = {
  gray: "bg-surface2 text-ink-faint border border-border-soft",
  green: "bg-good-soft text-good",
};

export default function StatusPill({
  children,
  tone = "gray",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${toneClasses[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
