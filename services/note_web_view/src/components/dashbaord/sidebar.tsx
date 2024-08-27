import { Note } from "@/app/dashboard/page";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getNotes } from "@/api/dummyNotes";

export default async function DashboardSidebar() {
  const notes = await getNotes();

  return (
    <Card className="w-64 mr-4 p-4 flex flex-col gap-2">
      <CardTitle>Documents</CardTitle>
      {notes.map((note) => (
        <Link href={`/dashboard/${note.note_id}`} key={note.note_id}>
          <Button>{note.title}</Button>
        </Link>
      ))}
    </Card>
  );
}
