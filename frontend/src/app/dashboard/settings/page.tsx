import Panel from "@/components/Panel";
import { EmptyInline } from "@/components/EmptyState";
import { SettingsIcon } from "@/components/icons";

export default function SettingsPage() {
  return (
    <div>
      <h3 className="mb-3.5 text-[15px] font-semibold">Settings</h3>

      <Panel title="Account" className="mb-4">
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            <tr>
              <td className="w-[180px] border-b border-border-soft py-2.5 text-ink-faint">
                Name
              </td>
              <td className="border-b border-border-soft py-2.5">Mohamed</td>
            </tr>
            <tr>
              <td className="py-2.5 text-ink-faint">Organization</td>
              <td className="py-2.5">Team</td>
            </tr>
          </tbody>
        </table>
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
