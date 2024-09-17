import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { noteSchema } from "~types/note.types"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const note = noteSchema.parse(req.body)
    const storage = new Storage({ area: "local" })
    await storage.setItem("selectedNote", note)
    res.send({ success: true })
  } catch (error) {
    console.error("Error selecting note:", error)
    res.send({ error: "Failed to select note" })
  }
}

export default handler
