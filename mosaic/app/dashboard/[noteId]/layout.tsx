// app/[noteId]/layout.tsx

import React from "react";
import { NoteNavigation } from "@/app/dashboard/[noteId]/components/note-navigation";
import { getNoteInfoAction } from "../note-actions";

interface LayoutProps {
  children: React.ReactNode;
  params: { noteId: string };
}

async function fetchNoteTitle(noteId: string) {
  // Replace with your actual data fetching logic
  return `Note Title for ${noteId}`;
}

export default async function NoteLayout({ children, params }: LayoutProps) {
  const { data, error } = await getNoteInfoAction(params.noteId);

  if (error || !data) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <NoteNavigation noteId={params.noteId} />
      <div>{children}</div>
    </div>
  );
}
