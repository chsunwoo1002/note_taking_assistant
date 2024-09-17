import type { Insertable, Kysely, Selectable, Updateable } from 'kysely';

import type {
  ContentTypesTable,
  DatabaseSchema,
  NoteContentsTable,
  NoteResultSummaryTable,
  NoteResultsTable,
  NotesTable,
  ResultTypesTable,
  UsersTable,
} from './database.interface';

export type User = Selectable<UsersTable>;
export type InsertUser = Insertable<UsersTable>;
export type UpdateUser = Updateable<UsersTable>;

export type Note = Selectable<NotesTable>;
export type InsertNote = Insertable<NotesTable>;
export type UpdateNote = Updateable<NotesTable>;

export type ContentType = Selectable<ContentTypesTable>;
export type InsertContentType = Insertable<ContentTypesTable>;
export type UpdateContentType = Updateable<ContentTypesTable>;

export type NoteContent = Selectable<NoteContentsTable>;
export type InsertNoteContent = Insertable<NoteContentsTable>;
export type UpdateNoteContent = Updateable<NoteContentsTable>;

export type ResultType = Selectable<ResultTypesTable>;
export type InsertResultType = Insertable<ResultTypesTable>;
export type UpdateResultType = Updateable<ResultTypesTable>;

export type NoteResult = Selectable<NoteResultsTable>;
export type InsertNoteResult = Insertable<NoteResultsTable>;
export type UpdateNoteResult = Updateable<NoteResultsTable>;

export type NoteResultSummary = Selectable<NoteResultSummaryTable>;
export type InsertNoteResultSummary = Insertable<NoteResultSummaryTable>;
export type UpdateNoteResultSummary = Updateable<NoteResultSummaryTable>;

export type DatabaseConnection = Kysely<DatabaseSchema>;

export type NoteResultWithTypeName = NoteResult & {
  type: string;
};
