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
  notes: NotesTable;
  content_types: ContentTypesTable;
  note_contents: NoteContentsTable;
  result_types: ResultTypesTable;
  note_results: NoteResultsTable;
  summaries: NoteResultSummaryTable;
}

export interface NotesTable {
  note_id: Generated<string>;
  title: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ContentTypesTable {
  content_type_id: Generated<string>;
  type_name: string; // change to enum
}

export interface NoteContentsTable {
  content_id: Generated<string>;
  note_id: string;
  content_type_id: string;
  content_text: string | null;
  file_url: string | null;
  timestamp: Date | null;
  source_url: string | null;
  created_at: Generated<Date>;
}

export interface ResultTypesTable {
  result_type_id: Generated<string>;
  type_name: string;
}

export interface NoteResultsTable {
  result_id: Generated<string>;
  note_id: string;
  result_type_id: string;
  file_url: string | null;
  order_index: number;
  content: string | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface NoteResultSummaryTable {
  summary_id: Generated<string>;
  note_id: string;
  content: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

/**
 * Interfaces for LLM services
 */

export interface OpenAIConfig {
  apiKey: string;
  organization: string;
}
