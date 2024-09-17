import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import NoteApiService from "~services/note.api"
import { createNoteRequestBody, type Note } from "~types/note.types"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const data = createNoteRequestBody.parse(req.body)
    const response = await NoteApiService.createNote(data)
    const storage = new Storage({ area: "local" })
    const notes = await storage.getItem<Note[]>("notes")
    await storage.setItem("notes", [...(notes ?? []), response])
    await storage.setItem("selectedNote", response)
    res.send({ success: true, note: response })
  } catch (error) {
    console.error("Error creating note:", error)
    res.send({ error: "Failed to create note" })
  }
}

export default handler
