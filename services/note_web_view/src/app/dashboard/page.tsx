import { getNotes } from "@/api/note.api";
import NoteWorkspace from "@/components/dashbaord/note-workspace";

export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface DashboardProps {
  notes: Note[];
}

export default async function Dashboard() {
  const notes = await getNotes();

  return <div>Dashboard</div>;
}
