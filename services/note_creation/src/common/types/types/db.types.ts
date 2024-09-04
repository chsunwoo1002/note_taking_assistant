import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type OpenAI from "openai";

import type {
  ContentTypesTable,
  DatabaseSchema,
  NoteContentsTable,
  NoteResultSummaryTable,
  NoteResultsTable,
  NotesTable,
  ResultTypesTable,
} from "@/common/types/interfaces/db.interface";

export type Note = Selectable<NotesTable>;
export type NewNote = Insertable<NotesTable>;
export type NoteUpdate = Updateable<NotesTable>;

export type ContentType = Selectable<ContentTypesTable>;
export type NewContentType = Insertable<ContentTypesTable>;
export type ContentTypeUpdate = Updateable<ContentTypesTable>;

export type NoteContent = Selectable<NoteContentsTable>;
export type NewNoteContent = Insertable<NoteContentsTable>;
export type NoteContentUpdate = Updateable<NoteContentsTable>;

export type ResultType = Selectable<ResultTypesTable>;
export type NewResultType = Insertable<ResultTypesTable>;
export type ResultTypeUpdate = Updateable<ResultTypesTable>;

export type NoteResult = Selectable<NoteResultsTable>;
export type NewNoteResult = Insertable<NoteResultsTable>;
export type NoteResultUpdate = Updateable<NoteResultsTable>;

export type NoteResultSummary = Selectable<NoteResultSummaryTable>;
export type NewNoteResultSummary = Insertable<NoteResultsTable>;
export type NoteResultSummaryUpdate = Updateable<NoteResultsTable>;

export type DatabaseConnection = Kysely<DatabaseSchema>;
export type OpenAIClient = OpenAI;

export type NoteResultWithTypeName = NoteResult & {
  type: string;
};
