import type { generatedNoteSchema } from "@/common/types/schema/note.schema";
import type { z } from "zod";

export type GeneratedNote = z.infer<typeof generatedNoteSchema>;
