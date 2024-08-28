import { z } from "zod";

const titleSchema = z.string();
const instructionSchema = z.string().optional();
const noteIdSchema = z.string().uuid("Invalid note ID");
const contentSchema = z.string();
const contentTypeSchema = z.enum(["text", "image", "video"]);
const summarySchema = z.string();
const documentTypeSchema = z.enum([
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "paragraph",
]);

export const notePostRequestSchema = z.object({
  body: z.object({
    title: titleSchema.max(200, "Title must be 200 characters or less"),
    instruction: instructionSchema,
  }),
});

export const noteGetRequestSchema = z.object({
  params: z.object({ noteId: noteIdSchema }),
});

export const noteContentPostRequestSchema = z.object({
  params: z.object({ noteId: noteIdSchema }),
  body: z.object({
    content: contentSchema,
    contentType: contentTypeSchema,
  }),
});

export const generatedNoteSchema = z.object({
  contents: z.array(
    z.object({
      type: documentTypeSchema,
      content: contentSchema,
    }),
  ),
});

export const generatedSummarySchema = z.object({
  summary: summarySchema,
});
