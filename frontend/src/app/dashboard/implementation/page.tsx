import StageTabs from "@/components/StageTabs";
import StatusPill from "@/components/StatusPill";
import SubTabs from "@/components/SubTabs";
import Panel from "@/components/Panel";
import { EmptyInline } from "@/components/EmptyState";
import { CodeIcon, DocIcon, LayersIcon, SparklesIcon } from "@/components/icons";

const COLUMNS = ["ID", "Title", "Assignee", "Status", "Linked PR", "Last Commit"];

function ImplementationDashboard() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold">Implementation Progress</h3>
        <StatusPill tone="gray">No project</StatusPill>
      </div>

      <SubTabs tabs={["User Stories", "Commits", "Pull Requests", "Code Coverage"]} />

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
          icon={<DocIcon className="h-[26px] w-[26px]" />}
          title="No user stories to implement"
          description="Implementation work will show up here once stories are approved."
        />
      </Panel>
    </div>
  );
}

export default function ImplementationPage() {
  return (
    <StageTabs
      chatTitle="How can I help with implementation today?"
      chatSubtitle="Pick a user story and I'll generate the code, tests, and a pull request for review."
      chatSuggestions={[
        { icon: <CodeIcon className="h-3.5 w-3.5" />, label: "Write a function" },
        { icon: <SparklesIcon className="h-3.5 w-3.5" />, label: "Refactor code" },
        { icon: <DocIcon className="h-3.5 w-3.5" />, label: "Explain an error" },
        { icon: <LayersIcon className="h-3.5 w-3.5" />, label: "Open a pull request" },
      ]}
      dashboard={<ImplementationDashboard />}
    />
  );
}
