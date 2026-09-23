import Button from "@/components/Button";
import StatCard from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import {
  ChartIcon,
  FolderIcon,
  LayersIcon,
  PlusIcon,
  SearchIcon,
  TestingIcon,
} from "@/components/icons";

export default function DashboardHomePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between rounded-xl2 border border-border-soft bg-surface px-7 py-6">
        <div>
          <h2 className="text-[19px] font-semibold">Welcome back</h2>
          <p className="mt-1 text-[13.5px] text-ink-dim">
            Here&apos;s an overview of your workspace. Create a project to begin
            tracking requirements, design, implementation, and testing in one place.
          </p>
        </div>
        <Button variant="primary" className="shrink-0">
          <PlusIcon className="h-[15px] w-[15px]" />
          New Project
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-3.5">
        <StatCard label="Active Projects" value={0} icon={<FolderIcon className="h-[15px] w-[15px]" />} tone="blue" />
        <StatCard label="User Stories" value={0} icon={<LayersIcon className="h-[15px] w-[15px]" />} tone="amber" />
        <StatCard label="Test Coverage" value="—" icon={<TestingIcon className="h-[15px] w-[15px]" />} tone="green" />
        <StatCard label="Open Pull Requests" value={0} icon={<ChartIcon className="h-[15px] w-[15px]" />} tone="purple" />
      </div>

      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold">Your Projects</h3>
        <div className="flex w-[230px] items-center gap-2 rounded-lg border border-border-soft bg-surface px-3 py-1.5">
          <SearchIcon className="h-[15px] w-[15px] text-ink-faint" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
          />
        </div>
      </div>

      <EmptyState
        icon={<FolderIcon className="h-[26px] w-[26px]" />}
        title="No projects yet"
        description="Create your first project to start turning requirements into a verified, working repository."
        action={
          <Button variant="primary">
            <PlusIcon className="h-[15px] w-[15px]" />
            New Project
          </Button>
        }
      />
    </div>
  );
}
