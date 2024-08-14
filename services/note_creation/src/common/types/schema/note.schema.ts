import { z } from "zod";

const titleSchema = z.string().max(200, "Title must be 200 characters or less");
const noteIdSchema = z.string().uuid("Invalid note ID");
const contentSchema = z.string();
const contentTypeSchema = z.enum(["text", "image", "video"]);

export const notePostRequestSchema = z.object({
  body: z.object({
    title: titleSchema,
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
