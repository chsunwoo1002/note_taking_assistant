import PauseRoundedIcon from "@mui/icons-material/PauseRounded"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import React from "react"

interface HeaderProps {
  started: boolean
  onResume: () => void
  onPause: () => void
}
const Header: React.FC<HeaderProps> = ({
  started,
  onResume,
  onPause
}: HeaderProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MosaicNote
        </Typography>
        <IconButton
          color="inherit"
          aria-label="settings"
          onClick={started ? onPause : onResume}>
          {started ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>
        <IconButton color="inherit" aria-label="settings">
          <SettingsRoundedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
