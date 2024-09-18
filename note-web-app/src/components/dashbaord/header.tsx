import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Search, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { LabeledIconButton } from "../common/labeled-icon-button";
import { IconButton } from "../common/icon-button";

export default function DashboardHeader() {
  return (
    <Card className="flex justify-between gap-2 p-4 border">
      <div className="flex items-center gap-2">
        <Input placeholder="Search" className="mr-4" />
        <IconButton
          icon={Search}
          ariaLabel="Search"
          tooltipContent="Search"
          variant="ghost"
        />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/api/auth/logout">
          <LabeledIconButton icon={LogOut} label="Logout" />
        </Link>
        <IconButton
          icon={Settings}
          ariaLabel="Settings"
          tooltipContent="Settings"
          variant="ghost"
        />
      </div>
    </Card>
  );
}
