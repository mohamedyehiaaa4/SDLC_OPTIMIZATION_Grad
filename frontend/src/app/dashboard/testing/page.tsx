import StageTabs from "@/components/StageTabs";
import StatCard from "@/components/StatCard";
import StatusPill from "@/components/StatusPill";
import SubTabs from "@/components/SubTabs";
import Panel from "@/components/Panel";
import { EmptyInline } from "@/components/EmptyState";
import { ChartIcon, DocIcon, SprintIcon, TestingIcon } from "@/components/icons";

const COLUMNS = ["Test Suite", "Passed", "Failed", "Coverage"];

function TestingDashboard() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold">Testing Dashboard</h3>
        <StatusPill tone="gray">No project</StatusPill>
      </div>

      <div className="mb-5 flex gap-3.5">
        <StatCard label="Total Tests" value={0} icon={<TestingIcon className="h-[15px] w-[15px]" />} tone="blue" />
        <StatCard label="Passed" value={0} icon={<TestingIcon className="h-[15px] w-[15px]" />} tone="green" />
        <StatCard label="Failed" value={0} icon={<TestingIcon className="h-[15px] w-[15px]" />} tone="amber" />
        <StatCard label="Coverage" value="—" icon={<ChartIcon className="h-[15px] w-[15px]" />} tone="purple" />
      </div>

      <SubTabs tabs={["Test Results", "Coverage", "Test Cases", "Automation"]} />

      <Panel>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {COLUMNS.map((h) => (
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
          icon={<TestingIcon className="h-[26px] w-[26px]" />}
          title="No test runs yet"
          description="Run tests from a project to see results and trends here."
        />
      </Panel>
    </div>
  );
}

export default function TestingPage() {
  return (
    <StageTabs
      chatTitle="How can I help with testing today?"
      chatSubtitle="Tell me which component or user story to test and I'll generate candidate tests and run them."
      chatSuggestions={[
        { icon: <TestingIcon className="h-3.5 w-3.5" />, label: "Generate tests" },
        { icon: <DocIcon className="h-3.5 w-3.5" />, label: "Explain a failure" },
        { icon: <ChartIcon className="h-3.5 w-3.5" />, label: "Improve coverage" },
        { icon: <SprintIcon className="h-3.5 w-3.5" />, label: "Run a test plan" },
      ]}
      dashboard={<TestingDashboard />}
    />
  );
}
