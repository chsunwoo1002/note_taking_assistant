import { Box, ThemeProvider } from "@mui/material"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import Footer from "~popup/Footer"
import Header from "~popup/Header"
import Main from "~popup/Main"
import NoteListMain from "~popup/NoteListMain"
import { popup } from "~styles/constant"
import theme from "~styles/theme"
import type { Note } from "~types/note.types"
import { API_URL, WEB_VIEW_URL } from "~utils/envConfig"

function IndexPopup() {
  const [permission] = useStorage({
    key: "permission",
    instance: new Storage({ area: "local" })
  })
  const [notes] = useStorage<Note[]>({
    key: "notes",
    instance: new Storage({ area: "local" })
  })
  const [selectedNote] = useStorage<Note>({
    key: "selectedNote",
    instance: new Storage({ area: "local" })
  })
  const [view, setView] = useState<"list" | "add">("list")

  useEffect(() => {
    console.log("notes", notes)
  }, [notes])
  const onPermissionToggle = () => {
    sendToBackground({
      name: "setPermission",
      body: { permission: !permission }
    })
  }

  const onViewChange = () => {
    setView(view === "list" ? "add" : "list")
  }

  const onNoteClick = (note: Note) => {
    sendToBackground({
      name: "selectNote",
      body: note
    })
  }

  const onDashboard = () => {
    console.log("onDashboard", WEB_VIEW_URL)
    sendToBackground({
      name: "openTab",
      body: { url: WEB_VIEW_URL }
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        width={popup.width}
        height={popup.height}
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column"
        }}>
        <Header
          onPermissionToggle={onPermissionToggle}
          onSettings={() => {
            sendToBackground({
              name: "openTab"
            })
          }}
          onViewChange={onViewChange}
          onDashboard={onDashboard}
          trackPermission={permission}
          view={view}
        />
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {view === "list" ? (
            <NoteListMain
              notes={notes}
              selectedNote={selectedNote}
              onNoteClick={onNoteClick}
            />
          ) : (
            <Main
              created={false}
              onAddThought={(idea) => {
                console.log("idea", idea)
              }}
              onCreate={async (title, instruction) => {
                const response = await sendToBackground({
                  name: "createNote",
                  body: { title, instruction }
                })
                console.log("response", response)
              }}
            />
          )}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default IndexPopup
