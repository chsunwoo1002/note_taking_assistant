import Typography from "@/components/ui/typography";
import NoteWorkspace from "@/app/dashboard/components/note-workspace";
import NoteCreationApi from "@/api/note.api";
import { Card } from "@/components/ui/card";
interface PageProps {
  params: { noteId: string };
}

export default async function DashboardContent({ params }: PageProps) {
  const noteBaseInfo = await NoteCreationApi.getNote(params.noteId);

  return (
    <Card className="flex flex-col gap-2 mt-4 p-4">
      <Typography variant="h2">{noteBaseInfo.title}</Typography>
      <NoteWorkspace noteId={params.noteId} />
    </Card>
  );
}
