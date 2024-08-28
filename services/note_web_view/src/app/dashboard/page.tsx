export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface DashboardProps {
  notes: Note[];
}

export default async function Dashboard() {
  return <div>Dashboard</div>;
}
