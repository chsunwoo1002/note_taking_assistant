import { Box, ThemeProvider } from "@mui/material"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import Footer from "~popup/Footer"
import Header from "~popup/Header"
import Main from "~popup/Main"
import { popup } from "~styles/constant"
import theme from "~styles/theme"
import { API_URL } from "~utils/envConfig"

function IndexPopup() {
  const [permission] = useStorage({
    key: "permission",
    instance: new Storage({ area: "local" })
  })

  return (
    <ThemeProvider theme={theme}>
      <Box
        minWidth={popup.width}
        minHeight={popup.height}
        sx={{
          bgcolor: "background.default",
          color: "text.primary"
        }}>
        <Header
          onPause={() => {
            sendToBackground({
              name: "setPermission",
              body: { permission: false }
            })
          }}
          onResume={() => {
            sendToBackground({
              name: "setPermission",
              body: { permission: true }
            })
          }}
          started={permission}
        />
        <Main
          created={false}
          onAddThought={(idea) => {
            console.log("idea", idea)
          }}
          onCreate={(title) => {
            fetch(`${API_URL}/note`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ title })
            })
          }}
          onView={() => {
            fetch(`${API_URL}/document`, {
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
