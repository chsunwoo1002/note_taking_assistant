import {
  Box,
  Button,
  Input,
  Link,
  Stack,
  Switch,
  ThemeProvider,
  Typography
} from "@mui/material"
import { useState } from "react"

import Footer from "~popup/Footer"
import Header from "~popup/Header"
import Main from "~popup/Main"
import { popup } from "~styles/constant"
import theme from "~styles/theme"

function IndexPopup() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        minWidth={popup.width}
        minHeight={popup.height}
        sx={{
          bgcolor: "background.default",
          color: "text.primary"
        }}>
        <Header onPause={() => {}} onResume={() => {}} started={false} />
        <Main
          created={false}
          onAddThought={(idea) => {
            console.log("idea", idea)
          }}
          onCreate={(title) => {
            fetch("http://localhost:3000/document/title", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ title })
            })
          }}
          onView={() => {
            fetch("http://localhost:3000/document", {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
            }).then((response) => {
              response.json().then((data) => {
                const newTab = window.open("", "_blank")
                newTab.document.write(data.result)
                newTab.document.close()
                newTab.focus()
              })
            })
          }}
        />
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default IndexPopup
