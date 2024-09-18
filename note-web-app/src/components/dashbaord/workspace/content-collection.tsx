import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/common/icon-button";
interface SegmentCollectionsProps {
  noteId: string;
}

export default async function SegmentCollections({
  noteId,
}: SegmentCollectionsProps) {
  const noteContents = await NoteCreationApi.getNoteContents(noteId);

  async function handleDeleteContent(formData: FormData) {
    "use server";
    const contentId = formData.get("contentId") as string;
    const noteId = formData.get("noteId") as string;

    await NoteCreationApi.deleteContent(contentId);
    revalidatePath(`/dashboard/${noteId}`);
  }

  if (noteContents.contents.length === 0) {
    return (
      <div>
        <Typography variant="h3">No Content found</Typography>
      </div>
    );
  }

  return (
    <div>
      {noteContents.contents.map((segment) => (
        <Card key={segment.contentId}>
          <CardContent>
            <div>{segment.contentText}</div>
            <div>last updated at {segment.createdAt.toLocaleDateString()}</div>
            <form action={handleDeleteContent}>
              <input type="hidden" name="contentId" value={segment.contentId} />
              <input type="hidden" name="noteId" value={noteId} />
              <IconButton
                type="submit"
                icon={Trash2}
                ariaLabel="Delete Content"
                tooltipContent="Delete Content"
                variant="ghost"
              />
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
