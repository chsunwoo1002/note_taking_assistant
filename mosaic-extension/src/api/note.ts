import { supabase } from "@/core/supabase";

export const createNote = async (title: string, instruction?: string) => {
  return supabase
    .from("notes")
    .insert({
      title,
      instruction,
    })
    .select("id, title")
    .single();
};

export const getNotes = async () => {
  const { data, error } = await supabase.from("notes").select("id, title");

  if (error) {
    return { error: error.message };
  }

  return { data };
};

export const createNoteContent = async (
  noteId: string,
  content: string,
  sourceUrl: string,
  contentType: "text" | "image" | "video" | "audio" | "file" = "text",
) => {
  return supabase.functions.invoke("add-text-with-vector", {
    body: {
      content,
      noteId,
      sourceUrl,
      contentType,
    },
  });
};
