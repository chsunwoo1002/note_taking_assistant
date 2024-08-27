import { Note } from "@/app/dashboard/page";
import { Card, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardContentProps {
  selectedNoteId?: number | null;
  notes: Note[];
}

export default function DashboardContent({
  selectedNoteId,
  notes,
}: DashboardContentProps) {
  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  return (
    <Card className="m-4">
      <CardTitle className="p-4">
        {selectedNote ? selectedNote.title : "Note Content"}
      </CardTitle>
      <CardContent>
        {selectedNote ? (
          <p>{selectedNote.content}</p>
        ) : (
          <p>Select a note to view its content.</p>
        )}
      </CardContent>
    </Card>
  );
}
