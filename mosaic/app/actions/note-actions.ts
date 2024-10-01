"use server";

import { createNoteResult } from "@/services/openai";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CreationFormFields } from "@/app/dashboard/create-note/components/creation-form";
import {
  createNoteResultSchema,
  createNoteSchema,
  deleteNoteSchema,
  getNoteInfoSchema,
} from "@/utils/schema";

export const createNoteAction = async (formData: CreationFormFields) => {
  const createNoteData = createNoteSchema.safeParse(formData);

  if (!createNoteData.success) {
    return { error: createNoteData.error.message };
  }

  const supabase = createClient();
  const { title, instruction } = createNoteData.data;

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
  const deleteNoteData = deleteNoteSchema.safeParse({
    contentId: formData.get("contentId"),
    fileUrl: formData.get("fileUrl"),
    noteId: formData.get("noteId"),
  });

  if (!deleteNoteData.success) {
    return { error: deleteNoteData.error.message };
  }

  const supabase = createClient();
  const { contentId, fileUrl, noteId } = deleteNoteData.data;

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
  const createNoteResultData = createNoteResultSchema.safeParse({
    noteId: formData.get("noteId"),
  });

  if (!createNoteResultData.success) {
    return { error: createNoteResultData.error.message };
  }
  const { noteId } = createNoteResultData.data;

  const { data, error: noteResultError } = await createNoteResult(noteId);

  if (noteResultError || !data) {
    return {
      error: noteResultError || "Failed to fetch note result data.",
    };
  }

  const { contents } = data;

  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    return { error: "Contents are required and must be a non-empty array." };
  }

  const supabase = createClient();
  const { error: rpcError } = await supabase.rpc("insert_note_results", {
    p_note_id: noteId,
    contents,
  });

  if (rpcError) {
    return { error: rpcError.message };
  }

  revalidatePath(`/dashboard/${noteId}/results`);

  return { success: true };
};

export const getNoteInfoAction = async (noteId: string) => {
  const getNoteInfoData = getNoteInfoSchema.safeParse({ noteId });

  if (!getNoteInfoData.success) {
    return { error: getNoteInfoData.error.message };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("title, instruction, created_at")
    .eq("id", getNoteInfoData.data.noteId)
    .single();

  return { data, error: error?.message };
};
