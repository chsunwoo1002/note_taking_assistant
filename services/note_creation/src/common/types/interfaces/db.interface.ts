import type { Generated } from "kysely";

/**
 * Interfaces for database configuration
 */

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
  givenName: string;
  familyName: string;
  nickname: string;
  name: string;
  picture: string;
  updatedAt: string;
  email: string;
  emailVerified: boolean;
}

export interface NotesTable {
  noteId: Generated<string>;
  title: string;
  instruction: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface ContentTypesTable {
  contentTypeId: Generated<string>;
  typeName: string;
}

export interface NoteContentsTable {
  contentId: Generated<string>;
  noteId: string;
  contentTypeId: string;
  contentText: string;
  fileUrl: string | null;
  timestamp: Date | null;
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

/**
 * Interfaces for LLM services
 */

export interface OpenAIConfig {
  apiKey: string;
  organization: string;
}
