import { supabase } from "@/core/supabase"

export const createNote = async (title: string, instruction?: string) => {
  return supabase
    .from("notes")
    .insert({
      title,
      instruction
    })
    .select("id, title")
    .single()
}

export const getNotes = async () => {
  const { data, error } = await supabase.from("notes").select("id, title")

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export const createNoteContent = async (
  noteId: string,
  content: string,
  sourceUrl: string,
  contentType: "text" | "image" | "video" | "audio" | "file" = "text"
) => {
  return supabase.rpc("insert_note_content", {
    p_note_id: noteId,
    p_content: content,
    p_source_url: sourceUrl,
    p_content_type: contentType
  })
}
