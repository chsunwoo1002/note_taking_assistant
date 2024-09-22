import { z } from "zod"

export const contentType = z.enum(["text", "image", "video"])
export const content = z.string()
export const title = z.string()
export const instruction = z.string().nullable()

export const noteId = z.string().uuid()
export const createdAt = z.string()
export const updatedAt = z.string()
export const trackPermission = z.boolean()

export const addTextRequestBody = z.object({
  noteId,
  content,
  contentType
})

export const createNoteRequestBody = z.object({
  title,
  instruction
})

export const getNoteRequestParams = z.object({
  noteId
})

export const noteSchema = z.object({
  title,
  instruction,
  noteId,
  createdAt,
  updatedAt
})

export const notesSchema = z.object({
  notes: z.array(noteSchema)
})
export type GetNoteRequestParams = z.infer<typeof getNoteRequestParams>
export type AddTextRequestParams = z.infer<typeof addTextRequestBody>
export type CreateNoteRequestParams = z.infer<typeof createNoteRequestBody>
export type Note = z.infer<typeof noteSchema>
export type TrackPermission = z.infer<typeof trackPermission>
export type Notes = z.infer<typeof notesSchema>
