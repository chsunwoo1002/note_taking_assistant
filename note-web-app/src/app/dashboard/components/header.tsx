import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Search, Settings, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { LabeledIconButton } from "../../../components/common/labeled-icon-button";
import { IconButton } from "../../../components/common/icon-button";

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
