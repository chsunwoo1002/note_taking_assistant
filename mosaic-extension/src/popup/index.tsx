import { createNote, getNotes } from "@/api/note"
import { Button } from "@/components/ui/button"
import { useFeatureToggle } from "@/hooks/useFeatureToggle"
import { useUser } from "@/hooks/useUser"
import { useEffect, useState } from "react"

import "@/style.css"

import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"

export default function IndexPopup() {
  const { user } = useUser()
  const { active, toggle } = useFeatureToggle()
  const [notes, setNotes] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [instruction, setInstruction] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await createNote(title, instruction)
    if (error) {
      console.error(error)
    } else {
      setNotes([...notes, data[0]])
      setTitle("")
      setInstruction("")
    }
  }

  useEffect(() => {
    if (user) {
      getNotes().then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setNotes(data)
        }
      })
    }
  }, [user])

  if (user === null)
    return (
      <div>
        <button
          onClick={() => {
            window.open("options.html", "_blank")
          }}>
          Login
        </button>
      </div>
    )

  return (
    <div>
      Hello World! {user?.email}
      <div className="flex items-center space-x-2">
        <Switch id="active" checked={active} onCheckedChange={toggle} />
        <Label htmlFor="active">Active</Label>
      </div>
      <div>
        list
        {notes.map((note) => (
          <div key={note.id}>{note.title}</div>
        ))}
      </div>
      <div>
        form
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Instruction"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}
