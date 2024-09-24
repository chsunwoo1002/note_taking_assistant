import { useFeatureToggle } from "@/hooks/useFeatureToggle"
import { useUser } from "@/hooks/useUser"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const textSelectionOverlay = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState<any>()
  const { user } = useUser()
  const { active } = useFeatureToggle()
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
        setSelectedText(selection)
      } else {
        setSelectedText(null)
      }
    }

    document.addEventListener("selectionchange", handleSelection)
    return () => {
      document.removeEventListener("selectionchange", handleSelection)
    }
  }, [])

  if (!active) return null

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
      <div>test</div>
      <div>user: {user?.email}</div>
    </div>
  )
}

export default textSelectionOverlay
