import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Search, Settings, LogOut } from "lucide-react";

export default function DashboardHeader() {
  return (
    <Card className="flex justify-between gap-2 p-4 border">
      <div className="flex items-center gap-2">
        <Input placeholder="Search" className="mr-4" />
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/api/auth/logout">
          <Button variant="outline" size="lg">
            Logout
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
