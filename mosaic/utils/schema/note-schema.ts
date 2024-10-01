import { z } from "zod";

const titleSchema = z.string().min(1);
const instructionSchema = z.string().optional();
const noteIdSchema = z.string().uuid();
const fileUrlSchema = z.string().optional();
const contentIdSchema = z.string().uuid();
const createdAtSchema = z.string();
const createNoteActionSchema = z.object({
  title: titleSchema,
  instruction: instructionSchema,
});

const deleteNoteActionSchema = z.object({
  contentId: contentIdSchema,
  fileUrl: fileUrlSchema,
  noteId: noteIdSchema,
});

const createNoteResultActionSchema = z.object({
  noteId: noteIdSchema,
});

const getNoteInfoActionSchema = z.object({
  noteId: noteIdSchema,
});

const getNoteInfoQuerySchema = z.object({
  title: titleSchema,
  instruction: instructionSchema,
  created_at: createdAtSchema,
});

type NoteInfo = z.infer<typeof getNoteInfoQuerySchema>;

export type { NoteInfo };
export {
  createNoteActionSchema,
  deleteNoteActionSchema,
  createNoteResultActionSchema,
  getNoteInfoActionSchema,
  getNoteInfoQuerySchema,
};
