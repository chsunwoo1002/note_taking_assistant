import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";

interface SummaryProps {
  noteId: string;
}

export default async function Summary({ noteId }: SummaryProps) {
  const noteSummary = await NoteCreationApi.getNoteSummary(noteId);

  if (!noteSummary) {
    return (
      <div>
        <Typography variant="h3">No summary found</Typography>
        <Button variant="outline">Create Summary</Button>
      </div>
    );
  }
  return (
    <div>
      <Button variant="outline">Regenerate</Button>
      <Button variant="outline">Edit</Button>
      <Typography variant="p">{noteSummary.content}</Typography>
    </div>
  );
}
