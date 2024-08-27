import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PauseRoundedIcon from "@mui/icons-material/PauseRounded"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded"
import ViewListIcon from "@mui/icons-material/ViewList"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import React from "react"

interface HeaderProps {
  trackPermission: boolean
  view: "list" | "add"
  onPermissionToggle: () => void
  onSettings: () => void
  onViewChange: () => void
  onDashboard: () => void
}
const Header: React.FC<HeaderProps> = ({
  trackPermission,
  view,
  onPermissionToggle,
  onSettings,
  onViewChange,
  onDashboard
}: HeaderProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MosaicNote
        </Typography>
        <IconButton color="inherit" aria-label="settings" onClick={onDashboard}>
          <DashboardIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="settings"
          onClick={onViewChange}>
          {view === "list" ? <AddCircleOutlineIcon /> : <ViewListIcon />}
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="settings"
          onClick={onPermissionToggle}>
          {trackPermission ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>
        <IconButton color="inherit" aria-label="settings" onClick={onSettings}>
          <SettingsRoundedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
