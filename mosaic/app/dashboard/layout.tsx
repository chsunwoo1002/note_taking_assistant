import { Sidebar } from "@/app/dashboard/components/sidebar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex w-full h-full">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4">
        <Card>{children}</Card>
      </div>
    </div>
  );
}
