import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { revalidatePath } from "next/cache";

interface SummaryProps {
  noteId: string;
}

export default async function Summary({ noteId }: SummaryProps) {
  const noteSummary = await NoteCreationApi.getNoteSummary(noteId);

  const createSummary = async () => {
    "use server";
    try {
      console.log("regenerate");
      await NoteCreationApi.createNoteSummary(noteId);

      revalidatePath(`/dashboard/${noteId}`);
    } catch (error) {
      console.error("Error creating summary:", error);
    }
  };

  if (!noteSummary) {
    return (
      <div>
        <Typography variant="h3">No summary found</Typography>
        <form action={createSummary}>
          <Button type="submit" variant="outline">
            Create Summary
          </Button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <form action={createSummary}>
        <Button type="submit" variant="outline">
          Regenerate
        </Button>
      </form>
      <Button variant="outline">Edit</Button>
      <Typography variant="p">{noteSummary.content}</Typography>
    </div>
  );
}
