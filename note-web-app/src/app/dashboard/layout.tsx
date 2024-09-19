import DashboardHeader from "@/app/dashboard/components/header";
import DashboardSidebar from "@/app/dashboard/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen p-4">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 ">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
