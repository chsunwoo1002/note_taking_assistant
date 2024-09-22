import { Storage } from "@plasmohq/storage"

import NoteApiService from "~services/note.api"

console.log("HELLO WORLD FROM BGSCRIPTS")

async function getNotes() {
  // const notes = await NoteApiService.getNotes()

  // console.log("note", notes)
  const storage = new Storage({ area: "local" })
  const extensionToken = await storage.get("extensionToken")

  if (extensionToken) {
    console.log("extensionToken", extensionToken)
    const notes = await NoteApiService.getNotes(extensionToken)
    console.log("notes", notes)
    await storage.set("notes", notes)
  } else {
    console.log("No extension token found")
  }
}

chrome.runtime.onMessageExternal.addListener(
  async function (request, sender, sendResponse) {
    if (request.type !== "EXTENSION_TOKEN") {
      return
    }
    if (sender.origin !== "http://localhost:3000") {
      return
    }
    const storage = new Storage({ area: "local" })
    await storage.set("extensionToken", request.token)
    getNotes()
    sendResponse({ success: true })
  }
)

getNotes()

export {}
