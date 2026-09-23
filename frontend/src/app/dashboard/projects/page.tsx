import Button from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { FolderIcon, PlusIcon } from "@/components/icons";

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold">All Projects</h3>
        <Button variant="primary">
          <PlusIcon className="h-[15px] w-[15px]" />
          New Project
        </Button>
      </div>

      <EmptyState
        icon={<FolderIcon className="h-[26px] w-[26px]" />}
        title="No projects yet"
        description="Projects you create or connect from GitHub will appear here, with their requirements, design, implementation, and test status."
      />
    </div>
  );
}
