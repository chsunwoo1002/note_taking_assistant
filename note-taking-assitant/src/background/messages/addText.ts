import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import NoteApiService from "~services/note.api"
import { addTextRequestBody, type Note } from "~types/note.types"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const storage = new Storage({ area: "local" })
    const selectedNote = await storage.getItem<Note>("selectedNote")
    console.log("selectedNote", selectedNote)
    console.log("req.body", req.body)
    const data = {
      ...req.body,
      noteId: selectedNote?.noteId
    }
    const note = addTextRequestBody.parse(data)
    await NoteApiService.addContent(note)
    res.send({ success: true })
  } catch (error) {
    console.error("Error adding text:", error)
    res.send({ error: "Failed to add text" })
  }
}

export default handler
