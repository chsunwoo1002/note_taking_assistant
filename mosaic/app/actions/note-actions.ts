"use server";

import { createNoteResult } from "@/services/openai";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CreationFormFields } from "@/app/dashboard/create-note/components/creation-form";

export const createNoteAction = async (formData: CreationFormFields) => {
  const { title, instruction } = formData;
  const supabase = createClient();

  if (!title) {
    return { error: "Title is required" };
  }

  const { error } = await supabase.from("notes").insert({
    title,
    instruction,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");

  return { success: true };
};

export const deleteNoteAction = async (formData: FormData) => {
  const contentId = formData.get("contentId")?.toString();
  const fileUrl = formData.get("fileUrl")?.toString();
  const noteId = formData.get("noteId")?.toString();
  const supabase = createClient();

  if (!contentId || !noteId) {
    return { error: "Content ID is required" };
  }

  const { error } = await supabase
    .from("note_contents")
    .delete()
    .eq("id", contentId);

  if (error) {
    return { error: error.message };
  }

  if (fileUrl) {
    const { error: storageError } = await supabase.storage
      .from("note-images")
      .remove([fileUrl]);
    if (storageError) {
      return { error: storageError.message };
    }
  }

  revalidatePath(`/dashboard/${noteId}/contents`);
};

export const createNoteResultAction = async (formData: FormData) => {
  const noteId = formData.get("noteId")?.toString();
  const supabase = createClient();

  if (!noteId) {
    return { error: "Note ID is required" };
  }

  // Assuming createNoteResult is a function that returns data with 'contents'
  const { data, error: noteResultError } = await createNoteResult(noteId);

  if (noteResultError || !data) {
    return {
      error: noteResultError
        ? noteResultError
        : "Failed to fetch note result data.",
    };
  }

  const contents = data.contents;

  // Corrected the conditional check
  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    return { error: "Contents are required and must be a non-empty array." };
  }

  // Convert 'contents' to JSON string if necessary
  // Supabase client handles JSON conversion, but you can use JSON.stringify(contents) if needed
  const { error: rpcError } = await supabase.rpc("insert_note_results", {
    p_note_id: noteId,
    contents,
  });

  if (rpcError) {
    return { error: rpcError.message };
  }

  // Revalidate the path if using Next.js or similar framework
  revalidatePath(`/dashboard/${noteId}/results`);

  return { success: true };
};

export const getNoteInfoAction = async (noteId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("title, instruction, created_at")
    .eq("id", noteId)
    .single();
  return { data, error: error?.message };
};
