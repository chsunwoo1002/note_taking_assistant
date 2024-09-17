import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import type { Note, TrackPermission } from "~types/note.types"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const storage = new Storage({ area: "local" })
    const permission = await storage.getItem<TrackPermission>("permission")
    const note = await storage.getItem<Note | null>("selectedNote")
    if (permission && note) {
      res.send({ isActivated: true, note })
    } else {
      res.send({ isActivated: false, note: null })
    }
  } catch (error) {
    console.error("Error checking activation:", error)
    res.send({ isActivated: false, note: null })
  }
}

export default handler
