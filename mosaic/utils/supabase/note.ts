"use server";

import { createClient } from "./server";

export const getNotes = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, instruction");

  if (error) {
    return { error: error.message };
  }

  return { data };
};

export const getNote = async (noteId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, instruction")
    .eq("id", noteId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
};

export const getNoteContents = async (noteId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("note_contents")
    .select(
      "id, content, source_url, created_at, file_url, content_types(type)"
    )
    .eq("note_id", noteId);

  if (error) {
    return { error: error.message };
  }

  const newData = await Promise.all(
    data.map(async (content) => {
      if (content.file_url && content.content_types?.type === "image") {
        const { data } = await supabase.storage
          .from("note-images")
          .createSignedUrl(content.file_url, 60 * 60 * 24);
        return { ...content, signedUrl: data?.signedUrl ?? null };
      }
      return { ...content, signedUrl: null };
    })
  );

  return { data: newData };
};

export const getNoteResult = async (noteId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("note_results")
    .select(
      `
      id,
      content,
      created_at,
      order,
      note_type ( type ),
      content_references (
        content_id,
        note_contents ( content, source_url )
      )
    `
    )
    .eq("note_id", noteId)
    .order("order");

  if (error) {
    return { error: error.message };
  }

  return { data };
};
