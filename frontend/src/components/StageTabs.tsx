"use client";

import { useState, type ReactNode } from "react";
import ChatPanel, { type ChatSuggestion } from "@/components/ChatPanel";
import StatusPill from "@/components/StatusPill";

export default function StageTabs({
  chatTitle,
  chatSubtitle,
  chatSuggestions,
  dashboard,
}: {
  chatTitle?: string;
  chatSubtitle: ReactNode;
  chatSuggestions?: ChatSuggestion[];
  dashboard: ReactNode;
}) {
  const [tab, setTab] = useState<"chat" | "dashboard">("chat");

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1 rounded-[10px] border border-border-soft bg-surface p-1">
          <button
            type="button"
            onClick={() => setTab("chat")}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              tab === "chat" ? "bg-accent text-white" : "text-ink-dim hover:text-ink"
            }`}
          >
            AI Chat
          </button>
          <button
            type="button"
            onClick={() => setTab("dashboard")}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              tab === "dashboard" ? "bg-accent text-white" : "text-ink-dim hover:text-ink"
            }`}
          >
            Dashboard
          </button>
        </div>
        <StatusPill tone="gray" dot>
          No project selected
        </StatusPill>
      </div>

      {tab === "chat" ? (
        <ChatPanel title={chatTitle} subtitle={chatSubtitle} suggestions={chatSuggestions} />
      ) : (
        dashboard
      )}
    </div>
  );
}
