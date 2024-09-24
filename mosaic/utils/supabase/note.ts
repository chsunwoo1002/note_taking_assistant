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
  console.log("data", data);

  if (error) {
    return { error: error.message };
  }

  return { data };
};

export const getNoteResult = async (noteId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("note_results")
    .select("id, content, created_at, order,note_type(type)");

  if (error) {
    return { error: error.message };
  }

  return { data };
};
