import { getNotes } from "@/api/dummyNotes";

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

  return <h1>Dashboard</h1>;
}
