import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1DB954",
      contrastText: "#fff"
    },
    // Add this section for background
    background: {
      default: "#121212", // A common dark gray used for dark themes
      paper: "#1E1E1E" // A slightly lighter shade for elevated surfaces
    },
    mode: "dark"
  }
})

export default theme
