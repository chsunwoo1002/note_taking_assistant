import { Note } from "@/app/dashboard/page";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NoteCreationApi from "@/api/note.api";
import { getSession } from "@auth0/nextjs-auth0";
import { Archive } from "lucide-react";
export default async function DashboardSidebar() {
  const { notes } = await NoteCreationApi.getAllNotes();

  return (
    <Card className="w-64 mr-4 p-4 flex flex-col gap-2">
      <CardTitle>
        <Archive className="h-4 w-4" /> Documents
      </CardTitle>
      {notes.map((note: any) => (
        <Link href={`/dashboard/${note.noteId}`} key={note.noteId}>
          <Button
            variant="outline"
            className="w-full h-10 text-left justify-start overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <span className="block truncate">{note.title}</span>
          </Button>
        </Link>
      ))}
    </Card>
  );
}
