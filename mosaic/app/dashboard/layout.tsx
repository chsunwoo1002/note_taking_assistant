import { Sidebar } from "@/app/dashboard/components/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-row">
      <Sidebar />
      <Separator orientation="vertical" className="h-full" />
      <div className="flex-1 bg-blue-500">{children}</div>
    </div>
  );
}
