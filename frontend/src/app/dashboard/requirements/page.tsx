import Panel from "@/components/Panel";
import StageTabs from "@/components/StageTabs";
import StatCard from "@/components/StatCard";
import StatusPill from "@/components/StatusPill";
import { EmptyInline } from "@/components/EmptyState";
import {
  TestingIcon as CheckIcon,
  DocIcon,
  LayersIcon,
  SparklesIcon,
  SprintIcon,
} from "@/components/icons";

function RequirementsDashboard() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold">Requirements &amp; User Stories</h3>
        <StatusPill tone="gray">No project</StatusPill>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-3.5">
        <StatCard label="Requirements" value={0} icon={<DocIcon className="h-[15px] w-[15px]" />} tone="blue" />
        <StatCard label="User Stories" value={0} icon={<LayersIcon className="h-[15px] w-[15px]" />} tone="amber" />
        <StatCard label="Sprints" value={0} icon={<SprintIcon className="h-[15px] w-[15px]" />} tone="green" />
        <StatCard label="Agreed" value="—" icon={<CheckIcon className="h-[15px] w-[15px]" />} tone="purple" />
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <Panel title="Upcoming Sprints">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Sprint", "Period", "User Stories", "Status"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-border-soft px-2.5 py-2 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody />
          </table>
          <EmptyInline
            icon={<DocIcon className="h-[26px] w-[26px]" />}
            title="No sprints planned"
            description="Sprints appear once requirements are approved."
          />
        </Panel>

        <Panel title="User Stories by Status">
          <EmptyInline
            icon={<DocIcon className="h-[26px] w-[26px]" />}
            title="No user stories yet"
            description="Draft stories in AI Chat to populate this view."
          />
        </Panel>
      </div>
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <StageTabs
      chatTitle="How can I help with requirements today?"
      chatSubtitle="Tell me what you want to build and I'll draft functional requirements, user stories, and acceptance criteria with you."
      chatSuggestions={[
        { icon: <DocIcon className="h-3.5 w-3.5" />, label: "Draft a user story" },
        { icon: <LayersIcon className="h-3.5 w-3.5" />, label: "Define acceptance criteria" },
        { icon: <SprintIcon className="h-3.5 w-3.5" />, label: "Plan a sprint" },
        { icon: <SparklesIcon className="h-3.5 w-3.5" />, label: "Refine scope" },
      ]}
      dashboard={<RequirementsDashboard />}
    />
  );
}
