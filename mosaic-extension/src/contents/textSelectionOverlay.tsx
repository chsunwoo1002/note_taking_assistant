import { createNoteContent } from "@/api/note"
import { useFeatureToggle } from "@/hooks/useFeatureToggle"
import { useSelectedNoteId } from "@/hooks/useSelectedNote"
import { useUser } from "@/hooks/useUser"
import cssText from "data-text:~style.css"
import { Plus } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const textSelectionOverlay = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState<any>()
  const { user } = useUser()
  const { active } = useFeatureToggle()
  const { selectedNoteId } = useSelectedNoteId()

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()

      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX
        })
        setSelectedText(selection.toString())
      } else {
        setSelectedText(null)
      }
    }

    document.addEventListener("selectionchange", handleSelection)
    return () => {
      document.removeEventListener("selectionchange", handleSelection)
    }
  }, [])

  const addTextToNote = () => {
    createNoteContent(selectedNoteId, selectedText, window.location.href).then(
      () => {
        setSelectedText(null)
      }
    )
  }

  if (!active || !user || !selectedText) return null

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        backgroundColor: "hsl(0 0% 3.9%)",
        padding: "4px",
        borderRadius: "4px"
      }}>
      <button title="Add content to note" onClick={addTextToNote}>
        <Plus color={"#f0fafa"} size={20} />
      </button>
    </div>
  )
}

export default textSelectionOverlay
