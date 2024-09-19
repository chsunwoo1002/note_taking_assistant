import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
import { Pencil, RefreshCw } from "lucide-react";
import { IconButton } from "@/components/common/icon-button";
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
          <IconButton
            type="submit"
            icon={RefreshCw}
            ariaLabel="Create Summary"
            tooltipContent="Create Summary"
            variant="ghost"
          />
        </form>
      </div>
    );
  }
  return (
    <div>
      <form action={createSummary}>
        <IconButton
          type="submit"
          icon={RefreshCw}
          ariaLabel="Create Summary"
          tooltipContent="Create Summary"
          variant="ghost"
        />
      </form>
      <IconButton
        icon={Pencil}
        ariaLabel="Edit Summary"
        tooltipContent="Edit Summary"
        variant="ghost"
      />
      <Typography variant="p">{noteSummary.content}</Typography>
    </div>
  );
}
