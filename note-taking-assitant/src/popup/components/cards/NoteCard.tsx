import { Button } from "@mui/material"

import type { Note } from "~types/note.types"

interface NoteCardProps {
  note: Note
  selected: boolean
  onNoteClick: (note: Note) => void
}

const NoteCard: React.FC<NoteCardProps> = ({ note, selected, onNoteClick }) => {
  return (
    <div>
      <Button
        variant="contained"
        color={selected ? "primary" : "secondary"}
        fullWidth
        onClick={() => onNoteClick(note)}>
        {note.title}
      </Button>
    </div>
  )
}

export default NoteCard
