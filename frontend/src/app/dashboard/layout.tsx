import { CurrentUserProvider } from "@/components/dashboard/CurrentUserProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrentUserProvider>
      <div className="flex h-screen w-full overflow-hidden bg-bg">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-8 pb-16 pt-7">
            <div className="mx-auto max-w-[1240px]">{children}</div>
          </main>
        </div>
      </div>
    </CurrentUserProvider>
  );
}
