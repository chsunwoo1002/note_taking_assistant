import { ExtensionTokenHandler } from "./components/extension-token-handler";

export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface DashboardProps {
  notes: Note[];
}

export default async function Dashboard() {
  return (
    <div>
      <ExtensionTokenHandler />
      Dashboard
    </div>
  );
}
