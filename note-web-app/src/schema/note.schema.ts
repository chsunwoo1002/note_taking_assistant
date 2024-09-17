import { z } from "zod";
import { nullableString, nullableUrl } from "./helper";

export const NoteSchema = z.object({
  noteId: z.string().uuid(),
  title: z.string(),
  instruction: nullableString(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const NoteListSchema = z.object({
  notes: z.array(NoteSchema),
});

export const SummarySchema = z.object({
  summaryId: z.string(),
  content: z.string(),
  noteId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const NoteContentSchema = z.object({
  contentId: z.string().uuid(),
  contentText: z.string(),
  typeName: z.enum(["text", "image", "video"]),
  fileUrl: nullableUrl(),
  sourceUrl: nullableUrl(),
  createdAt: z.coerce.date(),
});

export const NoteContentListSchema = z.object({
  noteId: z.string(),
  title: z.string(),
  instruction: nullableString(),
  contents: z.array(NoteContentSchema),
});

export const DocumentSchema = z.object({
  resultId: z.string(),
  content: nullableString(),
  orderIndex: z.number(),
  typeName: z.enum([
    "heading1",
    "heading2",
    "heading3",
    "heading4",
    "paragraph",
  ]),
  fileUrl: nullableUrl(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const DocumentListSchema = z.object({
  noteId: z.string(),
  documents: z.array(DocumentSchema),
});

// Inferred types
export type Note = z.infer<typeof NoteSchema>;
export type NoteList = z.infer<typeof NoteListSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type NoteContent = z.infer<typeof NoteContentSchema>;
export type NoteContentList = z.infer<typeof NoteContentListSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type DocumentList = z.infer<typeof DocumentListSchema>;
