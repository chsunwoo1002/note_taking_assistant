import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const textSelectionOverlay = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [selectedText, setSelectedText] = useState("")

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (selection.toString().length > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX
        })
        setSelectedText(selection.toString())
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setSelectedText("")
      }
    }

    document.addEventListener("selectionchange", handleSelection)
    return () => {
      document.removeEventListener("selectionchange", handleSelection)
    }
  }, [])
  const handleAddClick = () => {
    sendToBackground({ name: "addText", body: { text: selectedText } })
    setIsVisible(false)
    setSelectedText("")
  }
  if (!isVisible) return null

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        background: "white",
        border: "1px solid black",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 9999
      }}>
      <button onClick={handleAddClick}>Add</button>
    </div>
  )
}

export default textSelectionOverlay
