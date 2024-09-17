import type { Note } from "~types/note.types"

import NoteCard from "./components/cards/NoteCard"

interface NoteListMainProps {
  notes: Note[] | undefined
  selectedNote: Note | undefined
  onNoteClick: (note: Note) => void
}

const NoteListMain: React.FC<NoteListMainProps> = ({
  notes,
  selectedNote,
  onNoteClick
}) => {
  return (
    <div className="overflow-y-scroll">
      {notes && notes.length > 0 ? (
        notes.map((note) => (
          <NoteCard
            key={note.noteId}
            note={note}
            selected={selectedNote?.noteId === note.noteId}
            onNoteClick={onNoteClick}
          />
        ))
      ) : (
        <div>No notes</div>
      )}
    </div>
  )
}

export default NoteListMain
