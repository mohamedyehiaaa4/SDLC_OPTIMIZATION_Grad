import type { ReactNode } from "react";
import { CommandIcon, PaperclipIcon, SendIcon } from "@/components/icons";

export interface ChatSuggestion {
  icon: ReactNode;
  label: string;
}

export default function ChatPanel({
  title = "How can I help today?",
  subtitle,
  placeholder = "Ask RepoMind a question…",
  suggestions = [],
}: {
  title?: string;
  subtitle: ReactNode;
  placeholder?: string;
  suggestions?: ChatSuggestion[];
}) {
  return (
    <div>
      <div className="relative flex h-[560px] flex-col items-center justify-center overflow-hidden rounded-xl2 border border-border-soft bg-surface px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(480px 320px at 50% 38%, rgba(51,88,244,0.16), transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[460px] text-center">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mx-auto mt-2 max-w-[360px] text-[13px] leading-relaxed text-ink-dim">
            {subtitle}
          </p>

          <div className="mt-6 rounded-2xl border border-border-soft bg-surface2 p-3.5 text-left">
            <input
              type="text"
              placeholder={placeholder}
              disabled
              className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-ink-faint outline-none disabled:cursor-not-allowed"
            />
            <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-2.5">
              <div className="flex items-center gap-1.5 text-ink-faint">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-surface hover:text-ink-dim">
                  <PaperclipIcon className="h-[15px] w-[15px]" />
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-surface hover:text-ink-dim">
                  <CommandIcon className="h-[15px] w-[15px]" />
                </span>
              </div>
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-[12.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SendIcon className="h-[13px] w-[13px]" />
                Send
              </button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((s) => (
                <span
                  key={s.label}
                  className="flex items-center gap-1.5 rounded-full border border-border-soft bg-surface2 px-3.5 py-2 text-[12px] text-ink-dim"
                >
                  <span className="text-ink-faint">{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="pt-3 text-center text-[11.5px] text-ink-faint">
        Select or create a project to start this conversation.
      </p>
    </div>
  );
}
