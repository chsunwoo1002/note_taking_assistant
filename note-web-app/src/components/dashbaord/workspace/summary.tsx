import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
import { Pencil, RefreshCw } from "lucide-react";
interface SummaryProps {
  noteId: string;
}

export default async function Summary({ noteId }: SummaryProps) {
  const noteSummary = await NoteCreationApi.getSummary(noteId);

  const createSummary = async () => {
    "use server";
    try {
      console.log("regenerate");
      await NoteCreationApi.createSummary(noteId);

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
            <RefreshCw className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <form action={createSummary}>
        <Button type="submit" variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </form>
      <Button variant="ghost" size="icon">
        <Pencil className="h-4 w-4" />
      </Button>
      <Typography variant="p">{noteSummary.content}</Typography>
    </div>
  );
}
