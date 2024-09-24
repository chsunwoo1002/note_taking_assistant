import type { User } from "@supabase/supabase-js"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const textSelectionOverlay = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [selectedText, setSelectedText] = useState<any>()
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {
    const handleSelection = () => {
      console.log("selection")
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX
        })
        setSelectedText(selection)
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setSelectedText(null)
      }
    }

    document.addEventListener("selectionchange", handleSelection)
    return () => {
      document.removeEventListener("selectionchange", handleSelection)
    }
  }, [])

  //   if (!isVisible) return null

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
