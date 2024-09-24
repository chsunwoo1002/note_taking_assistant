import { Card } from "@/components/ui/card";
import { getNotes } from "@/utils/supabase/note";
import Link from "next/link";

export async function Sidebar() {
  const notes = await getNotes();

  if (notes.error || !notes.data) {
    return <div>{notes.error}</div>;
  }

  return (
    <Card className="w-64 mr-4 p-4 flex flex-col gap-2 ">
      <Link href="/dashboard/create-note">Create Note</Link>
      {notes.data.map((note) => (
        <Card key={note.id}>
          <Link href={`/dashboard/${note.id}/contents`}>{note.title}</Link>
        </Card>
      ))}
    </Card>
  );
}
