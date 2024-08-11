import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded"
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded"
import { Box, IconButton, Link, Typography } from "@mui/material"
import React from "react"

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "background.paper",
        padding: 1,
        borderTop: 1,
        borderColor: "divider"
      }}>
      <IconButton color="inherit" aria-label="settings">
        <RateReviewRoundedIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="settings">
        <ReportProblemRoundedIcon />
      </IconButton>
    </Box>
  )
}

export default Footer
