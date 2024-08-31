import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { revalidatePath } from "next/cache";

interface NoteProps {
  noteId: string;
}

export default async function Document({ noteId }: NoteProps) {
  const document = await NoteCreationApi.getDocument(noteId);

  const createDocument = async () => {
    "use server";
    try {
      await NoteCreationApi.createDocument(noteId);
      revalidatePath(`/dashboard/${noteId}`);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  if (document.length === 0) {
    return (
      <div>
        <Typography variant="h3">No document found</Typography>
        <form action={createDocument}>
          <Button type="submit" variant="outline">
            Create Document
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <form action={createDocument}>
        <Button type="submit" variant="outline">
          Regenerate
        </Button>
      </form>
      <Button variant="outline">Edit</Button>
      <Card>
        {document.map((note: any) => {
          if (note.type === "heading1") {
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
