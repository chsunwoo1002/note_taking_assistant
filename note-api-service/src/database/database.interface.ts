import { Generated } from 'kysely';

export interface IDatabaseConfig {
  database: string;
  host: string;
  user: string;
  port: number;
  max: number;
  password: string;
  ssl: {
    rejectUnauthorized: boolean;
    ca: string;
  };
}

export interface DatabaseSchema {
  users: UsersTable;
  notes: NotesTable;
  contentTypes: ContentTypesTable;
  noteContents: NoteContentsTable;
  resultTypes: ResultTypesTable;
  noteResults: NoteResultsTable;
  summaries: NoteResultSummaryTable;
}

export interface UsersTable {
  userId: string;
  givenName: string | null;
  familyName: string | null;
  nickname: string | null;
  name: string | null;
  picture: string | null;
  updatedAt: Date;
  createdAt: Generated<Date>;
  email: string;
  emailVerified: boolean;
}

export interface NotesTable {
  noteId: Generated<string>;
  userId: string;
  title: string;
  instruction: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface ContentTypesTable {
  contentTypeId: Generated<string>;
  typeName: 'text' | 'image' | 'video';
}

export interface NoteContentsTable {
  contentId: Generated<string>;
  noteId: string;
  contentTypeId: string;
  contentText: string | null;
  fileUrl: string | null;
  sourceUrl: string | null;
  createdAt: Generated<Date>;
}

export interface ResultTypesTable {
  resultTypeId: Generated<string>;
  typeName: string;
}

export interface NoteResultsTable {
  resultId: Generated<string>;
  noteId: string;
  resultTypeId: string;
  fileUrl: string | null;
  orderIndex: number;
  content: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface NoteResultSummaryTable {
  summaryId: Generated<string>;
  noteId: string;
  content: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}
