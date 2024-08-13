import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

export type Note = z.infer<typeof NoteSchema>;
export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const NoteValidation = {
  id: commonValidations.id,
  title: z.string(),
  content: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
};

// Input Validation for 'POST /note' endpoint
export const CreateNoteSchema = z.object({
  body: z.object({
    title: NoteValidation.title,
  }),
});

// Input Validation for 'GET /note/:id' endpoint
export const GetNoteSchema = z.object({
  params: z.object({ id: NoteValidation.id }),
});

// Input Validation for 'PUT /note/:id' endpoint
export const UpdateNoteSchema = z.object({
  params: z.object({ id: NoteValidation.id }),
  body: z.object({
    content: NoteValidation.content,
  }),
});
