import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-[#5470ff]",
  secondary:
    "bg-surface2 text-ink border border-border hover:bg-[#262b31]",
  ghost: "bg-transparent text-ink-dim border border-border-soft hover:bg-surface2",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
