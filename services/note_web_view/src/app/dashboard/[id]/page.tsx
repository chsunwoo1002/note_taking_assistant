import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Note } from "../page";
import { getNoteWithId } from "@/api/dummyNotes";
import Typography from "@/components/ui/typography";
interface PageProps {
  params: { id: string };
}

export default async function DashboardContent({ params }: PageProps) {
  const notes = await getNoteWithId(params.id);

  return (
    <Card>
      {notes.map((note: any) => {
        if (note.type === "title" || note.type === "heading1") {
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
  );
}
