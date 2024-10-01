import { z } from "zod";

const titleSchema = z.string().min(1);
const instructionSchema = z.string().optional();
const noteIdSchema = z.string().uuid();
const fileUrlSchema = z.string().optional();
const contentIdSchema = z.string().uuid();

const createNoteSchema = z.object({
  title: titleSchema,
  instruction: instructionSchema,
});

const deleteNoteSchema = z.object({
  contentId: contentIdSchema,
  fileUrl: fileUrlSchema,
  noteId: noteIdSchema,
});

const createNoteResultSchema = z.object({
  noteId: noteIdSchema,
});

const getNoteInfoSchema = z.object({
  noteId: noteIdSchema,
});

export {
  createNoteSchema,
  deleteNoteSchema,
  createNoteResultSchema,
  getNoteInfoSchema,
};
