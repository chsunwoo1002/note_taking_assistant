import { z } from "zod";

const titleSchema = z.string();
const noteIdSchema = z.string().uuid("Invalid note ID");
const contentSchema = z.string();
const contentTypeSchema = z.enum(["text", "image", "video"]);
const summarySchema = z.string();
const documentTypeSchema = z.enum([
  "title",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "paragraph",
]);

export const notePostRequestSchema = z.object({
  body: z.object({
    title: titleSchema.max(200, "Title must be 200 characters or less"),
  }),
});

export const noteGetRequestSchema = z.object({
  params: z.object({ note_id: noteIdSchema }),
});

export const noteContentPostRequestSchema = z.object({
  params: z.object({ note_id: noteIdSchema }),
  body: z.object({
    content: contentSchema,
    content_type: contentTypeSchema,
  }),
});

export const generatedNoteSchema = z.object({
  summary: summarySchema,
  contents: z.array(
    z.object({
      type: documentTypeSchema,
      content: contentSchema,
    }),
  ),
});
