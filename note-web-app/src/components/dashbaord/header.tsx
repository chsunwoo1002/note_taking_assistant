import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

export default function DashboardHeader() {
  return (
    <Card className="flex justify-between gap-2 p-4 border">
      <div className="flex items-center gap-2">
        <Input placeholder="Search" className="mr-4" />
        <Button variant="outline">Search</Button>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/api/auth/logout">
          <Button variant="outline">Logout</Button>
        </Link>
        <Button variant="outline">Settings</Button>
      </div>
    </Card>
  );
}
