import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getNoteWithId } from "@/api/note.api";
import Typography from "@/components/ui/typography";
import NoteWorkspace from "@/components/dashbaord/note-workspace";
interface PageProps {
  params: { noteId: string };
}

export default async function DashboardContent({ params }: PageProps) {
  return (
    <div className="flex flex-col gap-4">
      <NoteWorkspace noteId={params.noteId} />
    </div>
  );
}
