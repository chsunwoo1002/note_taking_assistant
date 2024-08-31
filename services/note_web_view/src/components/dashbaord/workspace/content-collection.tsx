import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { revalidatePath } from "next/cache";

interface SegmentCollectionsProps {
  noteId: string;
}

export default async function SegmentCollections({
  noteId,
}: SegmentCollectionsProps) {
  const noteSegments = await NoteCreationApi.getNoteSegments(noteId);

  const deleteSegment = async (segmentId: string) => {
    "use server";
    await NoteCreationApi.deleteNoteSegment(segmentId);
    revalidatePath(`/dashboard/${noteId}`);
  };

  if (noteSegments.length === 0) {
    return (
      <div>
        <Typography variant="h3">No segments found</Typography>
      </div>
    );
  }

  return (
    <div>
      {noteSegments.map((segment) => (
        <Card key={segment.contentId}>
          <CardContent>
            <div>{segment.contentText}</div>
            <div>last updated at {segment.createdAt}</div>
            <form action={() => deleteSegment(segment.contentId)}>
              <Button type="submit" variant="outline">
                Delete
              </Button>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
