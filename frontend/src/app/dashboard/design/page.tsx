import StageTabs from "@/components/dashboard/StageTabs";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import SubTabs from "@/components/ui/SubTabs";
import Panel from "@/components/ui/Panel";
import {
  ChartIcon,
  DesignIcon,
  DocIcon,
  LayersIcon,
  TestingIcon as ApprovedIcon,
} from "@/components/ui/icons";

function DesignDashboard() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold">System Design</h3>
        <StatusPill tone="gray">No project</StatusPill>
      </div>

      <SubTabs tabs={["Overview", "Architecture Diagrams", "Components", "Technology Stack"]} />

      <Panel title="System Architecture" className="mb-4">
        <div className="flex h-[220px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-surface2 text-ink-faint">
          <LayersIcon className="h-[26px] w-[26px]" />
          <span>No architecture proposed yet</span>
        </div>
      </Panel>

      <div className="grid grid-cols-3 gap-3.5">
        <StatCard label="Approved" value={0} icon={<ApprovedIcon className="h-[15px] w-[15px]" />} tone="green" />
        <StatCard label="In Progress" value={0} icon={<ChartIcon className="h-[15px] w-[15px]" />} tone="amber" />
        <StatCard label="Not Started" value={0} icon={<DocIcon className="h-[15px] w-[15px]" />} tone="blue" />
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <StageTabs
      chatTitle="How can I help with the design today?"
      chatSubtitle="Tell me your design preferences or constraints and I'll propose services, data stores, and an architecture ready for review."
      chatSuggestions={[
        { icon: <LayersIcon className="h-3.5 w-3.5" />, label: "Propose architecture" },
        { icon: <DocIcon className="h-3.5 w-3.5" />, label: "Design a data model" },
        { icon: <ChartIcon className="h-3.5 w-3.5" />, label: "Compare tradeoffs" },
        { icon: <DesignIcon className="h-3.5 w-3.5" />, label: "Diagram a flow" },
      ]}
      dashboard={<DesignDashboard />}
    />
  );
}
