import { z } from "zod";

export const CreateNoteRequestSchema = z.object({
  title: z.string(),
  instruction: z.string().optional(),
});

export const createNoteContentRequestSchema = z.object({
  contentText: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  contentType: z.enum(["text", "image", "video"]),
});

export const createNoteIdParamSchema = z.object({
  params: z.object({
    noteId: z.string(),
  }),
});

export type CreateNoteRequest = z.infer<typeof CreateNoteRequestSchema>;
export type CreateNoteContentRequest = z.infer<
  typeof createNoteContentRequestSchema
>;
export type CreateNoteIdParam = z.infer<typeof createNoteIdParamSchema>;
