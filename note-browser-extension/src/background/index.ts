import { Storage } from "@plasmohq/storage"

import NoteApiService from "~services/note.api"

console.log("HELLO WORLD FROM BGSCRIPTS")

async function init() {
  const notes = await NoteApiService.getNotes()
  console.log("note", notes)
  const storage = new Storage({ area: "local" })
  await storage.set("notes", notes)
}

init()

export {}
