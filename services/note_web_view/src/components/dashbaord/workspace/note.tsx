import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Typography from "@/components/ui/typography";

interface NoteProps {
  noteId: string;
}

export default async function NoteView({ noteId }: NoteProps) {
  const document = await NoteCreationApi.getNoteDocument(noteId);

  if (document.length === 0) {
    return (
      <div>
        <Typography variant="h3">No document found</Typography>
        <Button variant="outline">Create Document</Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="outline">Regenerate</Button>
      <Button variant="outline">Edit</Button>
      <Card>
        {document.map((note: any) => {
          if (note.type === "title") {
            return null;
          } else if (note.type === "heading1") {
            return (
              <Typography variant="h1" key={note.id}>
                {note.content}
              </Typography>
            );
          } else if (note.type === "heading2") {
            return (
              <Typography variant="h2" key={note.id}>
                {note.content}
              </Typography>
            );
          } else if (note.type === "heading3") {
            return (
              <Typography variant="h3" key={note.id}>
                {note.content}
              </Typography>
            );
          } else if (note.type === "heading4") {
            return (
              <Typography variant="h4" key={note.id}>
                {note.content}
              </Typography>
            );
          } else {
            return (
              <Typography variant="p" key={note.id}>
                {note.content}
              </Typography>
            );
          }
        })}
      </Card>
    </div>
  );
}
