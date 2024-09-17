import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { revalidatePath } from "next/cache";
import { RefreshCw, Pencil } from "lucide-react";
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

  if (document.documents.length === 0) {
    return (
      <div>
        <Typography variant="h3">No document found</Typography>
        <form action={createDocument}>
          <Button type="submit" variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <form action={createDocument}>
        <Button type="submit" variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </form>
      <Button variant="ghost" size="icon">
        <Pencil className="h-4 w-4" />
      </Button>
      <Card>
        {document.documents.map((note) => {
          if (note.typeName === "heading1") {
            return (
              <Typography variant="h1" key={note.resultId}>
                {note.content}
              </Typography>
            );
          } else if (note.typeName === "heading2") {
            return (
              <Typography variant="h2" key={note.resultId}>
                {note.content}
              </Typography>
            );
          } else if (note.typeName === "heading3") {
            return (
              <Typography variant="h3" key={note.resultId}>
                {note.content}
              </Typography>
            );
          } else if (note.typeName === "heading4") {
            return (
              <Typography variant="h4" key={note.resultId}>
                {note.content}
              </Typography>
            );
          } else {
            return (
              <Typography variant="p" key={note.resultId}>
                {note.content}
              </Typography>
            );
          }
        })}
      </Card>
    </div>
  );
}
