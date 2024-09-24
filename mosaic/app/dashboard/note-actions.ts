"use server";

import { createNoteResult } from "@/lib/openai";
import { getNoteContents } from "@/utils/supabase/note";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const createNoteAction = async (formData: FormData) => {
  const title = formData.get("title")?.toString();
  const instruction = formData.get("instruction")?.toString();
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
};

export const deleteNoteAction = async (formData: FormData) => {
  const contentId = formData.get("contentId")?.toString();
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

  console.log("data", data);
  console.log("noteResultError", noteResultError);

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
    console.log("contents", contents);
    return { error: "Contents are required and must be a non-empty array." };
  }

  console.log("contents here", contents);

  // Convert 'contents' to JSON string if necessary
  // Supabase client handles JSON conversion, but you can use JSON.stringify(contents) if needed
  const { error: rpcError } = await supabase.rpc("insert_note_results", {
    p_note_id: noteId,
    contents, // Pass 'contents' directly; Supabase handles JSON conversion
  });

  console.log("rpcError", rpcError);

  if (rpcError) {
    return { error: rpcError.message };
  }

  // Revalidate the path if using Next.js or similar framework
  revalidatePath(`/dashboard/${noteId}/results`);

  return { success: true };
};
