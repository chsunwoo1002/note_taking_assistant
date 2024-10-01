"use server";

import { createNoteResult } from "@/services/openai";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CreationFormFields } from "@/app/dashboard/create-note/components/creation-form";
import {
  createNoteResultActionSchema,
  createNoteActionSchema,
  deleteNoteActionSchema,
  getNoteInfoActionSchema,
  getNoteInfoQuerySchema,
  NoteInfo,
} from "@/utils/schema";
import { ActionResponse, createActionResponse } from "@/utils/action-response";

export const createNoteAction = async (formData: CreationFormFields) => {
  const createNoteData = createNoteActionSchema.safeParse(formData);

  if (!createNoteData.success) {
    return createActionResponse({ error: createNoteData.error.message });
  }

  const supabase = createClient();
  const { title, instruction } = createNoteData.data;

  const { error } = await supabase.from("notes").insert({
    title,
    instruction,
  });

  if (error) {
    return createActionResponse({ error: error.message });
  }

  revalidatePath("/dashboard");

  return createActionResponse({ data: null });
};

export const deleteNoteAction = async (formData: FormData) => {
  const deleteNoteData = deleteNoteActionSchema.safeParse({
    contentId: formData.get("contentId"),
    fileUrl: formData.get("fileUrl"),
    noteId: formData.get("noteId"),
  });

  if (!deleteNoteData.success) {
    return createActionResponse({ error: deleteNoteData.error.message });
  }

  const supabase = createClient();
  const { contentId, fileUrl, noteId } = deleteNoteData.data;

  const { error } = await supabase
    .from("note_contents")
    .delete()
    .eq("id", contentId);

  if (error) {
    return createActionResponse({ error: error.message });
  }

  if (fileUrl) {
    const { error: storageError } = await supabase.storage
      .from("note-images")
      .remove([fileUrl]);
    if (storageError) {
      return createActionResponse({ error: storageError.message });
    }
  }

  revalidatePath(`/dashboard/${noteId}/contents`);

  return createActionResponse({ data: null });
};

export const createNoteResultAction = async (formData: FormData) => {
  const createNoteResultData = createNoteResultActionSchema.safeParse({
    noteId: formData.get("noteId"),
  });

  if (!createNoteResultData.success) {
    return createActionResponse({ error: createNoteResultData.error.message });
  }
  const { noteId } = createNoteResultData.data;

  const { data, error: noteResultError } = await createNoteResult(noteId);

  if (noteResultError || !data) {
    return createActionResponse({
      error: noteResultError || "Failed to fetch note result data.",
    });
  }

  const { contents } = data;

  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    return createActionResponse({
      error: "Contents are required and must be a non-empty array.",
    });
  }

  const supabase = createClient();
  const { error: rpcError } = await supabase.rpc("insert_note_results", {
    p_note_id: noteId,
    contents,
  });

  if (rpcError) {
    return createActionResponse({ error: rpcError.message });
  }

  revalidatePath(`/dashboard/${noteId}/results`);

  return createActionResponse({ data: null });
};

export const getNoteInfoAction = async (
  noteId: string
): Promise<ActionResponse<NoteInfo>> => {
  const getNoteInfoData = getNoteInfoActionSchema.safeParse({ noteId });

  if (!getNoteInfoData.success) {
    return createActionResponse({ error: getNoteInfoData.error.message });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("title, instruction, created_at")
    .eq("id", getNoteInfoData.data.noteId)
    .single();

  if (error) {
    return createActionResponse({ error: error.message });
  }

  const parsedData = getNoteInfoQuerySchema.safeParse(data);

  if (!parsedData.success) {
    return createActionResponse({ error: parsedData.error.message });
  }

  return createActionResponse({ data: parsedData.data });
};
