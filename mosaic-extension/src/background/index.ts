import { supabase } from "@/core/supabase"

import { Storage } from "@plasmohq/storage"

// Create the context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "storeImageToNote",
    title: "Store image to note",
    contexts: ["image"]
  })
})

// Handle the context menu item click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "storeImageToNote") {
    await handleImageUpload(info, tab)
  }
})

async function handleImageUpload(info, tab) {
  const imageUrl = info.srcUrl
  const websiteUrl = tab?.url || info.pageUrl

  try {
    const blob = await fetchImageAsBlob(imageUrl)
    if (!blob) return

    const fileName = generateFileName(imageUrl)
    const selectedNote = await getSelectedNote()

    const formData = createFormData(blob, fileName, selectedNote, websiteUrl)

    await uploadImage(formData)
  } catch (error) {
    handleUploadError(error)
  }
}

async function fetchImageAsBlob(url) {
  const response = await fetch(url)
  if (!response.ok) {
    console.error("Failed to fetch image")
    return null
  }
  return await response.blob()
}

function generateFileName(imageUrl) {
  const urlParts = new URL(imageUrl)
  const pathname = urlParts.pathname
  let fileExtension = pathname.split(".").pop()
  if (!fileExtension || fileExtension.length > 5) {
    fileExtension = "png"
  }
  return `images/${Date.now()}.${fileExtension}`
}

async function getSelectedNote() {
  const storage = new Storage({ area: "local" })
  return await storage.get("selectedNote")
}

function createFormData(blob, fileName, noteId, sourceUrl) {
  const formData = new FormData()
  formData.append("image", blob, fileName)
  formData.append("noteId", noteId)
  formData.append("sourceUrl", sourceUrl)
  return formData
}

async function uploadImage(formData) {
  await supabase.functions.invoke("upload-image", { body: formData })
}

function handleUploadError(error) {
  console.error("Error fetching or uploading image:", error.message)
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "Image Upload Failed",
    message: `Error: ${error.message}`
  })
}
