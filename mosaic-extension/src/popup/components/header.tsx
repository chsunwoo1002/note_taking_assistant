import { signOut } from "@/api/auth"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { useFeatureToggle } from "@/hooks/useFeatureToggle"
import { useUser } from "@/hooks/useUser"
import { List, LogOut, Pause, Play, Plus } from "lucide-react"

interface HeaderProps {
  mode: "edit" | "create"
  toggleMode: () => void
}
export const Header = ({ mode, toggleMode }: HeaderProps) => {
  const { active, toggle } = useFeatureToggle()
  const { setUser } = useUser()

  return (
    <div className="flex items-center justify-between p-2 flex-row">
      <h1 className="text-xl font-semibold">Mosaic</h1>
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" onClick={toggleMode}>
              {mode === "create" ? <List /> : <Plus />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            {mode === "create" ? "View notes" : "Create note"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" onClick={toggle}>
              {active ? <Pause /> : <Play />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            {active ? "Pause" : "Resume"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                signOut()
                setUser(null)
              }}>
              <LogOut />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">Logout</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
