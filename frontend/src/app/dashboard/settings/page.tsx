import Panel from "@/components/Panel";
import { EmptyInline } from "@/components/EmptyState";
import { SettingsIcon } from "@/components/icons";
import AccountDetails from "@/components/AccountDetails";

export default function SettingsPage() {
  return (
    <div>
      <h3 className="mb-3.5 text-[15px] font-semibold">Settings</h3>

      <Panel title="Account" className="mb-4">
        <AccountDetails />
      </Panel>

      <Panel title="Integrations">
        <EmptyInline
          icon={<SettingsIcon className="h-[26px] w-[26px]" />}
          title="No integrations connected"
          description="Connect GitHub and Jira to enable repository creation and backlog provisioning."
        />
      </Panel>
    </div>
  );
}
