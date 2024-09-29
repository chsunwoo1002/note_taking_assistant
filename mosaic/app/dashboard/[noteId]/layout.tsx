// app/[noteId]/layout.tsx

import React from "react";
import { NoteNavigation } from "@/app/dashboard/[noteId]/components/note-navigation";
import { getNoteInfoAction } from "@/app/actions/note-actions";

interface LayoutProps {
  children: React.ReactNode;
  params: { noteId: string };
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
