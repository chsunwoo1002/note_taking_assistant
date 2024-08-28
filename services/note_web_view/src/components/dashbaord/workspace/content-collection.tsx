import NoteCreationApi from "@/api/note.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";

interface SegmentCollectionsProps {
  noteId: string;
}

export default async function SegmentCollections({
  noteId,
}: SegmentCollectionsProps) {
  const noteSegments = await NoteCreationApi.getNoteSegments(noteId);

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
            <Button variant="outline">Delete</Button>
            <Button variant="outline">Edit</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
