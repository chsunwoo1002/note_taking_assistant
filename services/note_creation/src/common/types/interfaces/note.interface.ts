import type { ServiceResponse } from "@/common/models/serviceResponse";
import type {
  Note,
  NoteContent,
  NoteResultSummary,
  NoteResultWithTypeName,
} from "@/common/types/types/db.types";
import type { GeneratedNote } from "../types/note.types";

export interface INoteRepository {
  createNote(title: string, instruction: string | null): Promise<Note>;
  getNote(noteId: string): Promise<Note>;
  createNoteSummary(
    noteId: string,
    content: string,
  ): Promise<NoteResultSummary>;
  getNoteSummary(noteId: string): Promise<NoteResultSummary | null>;
  deleteNoteSummary(noteId: string): Promise<void>;
  addNoteSegment(
    noteId: string,
    contentTypeId: string,
    content: string,
  ): Promise<void>;
  getNoteSegments(noteId: string): Promise<NoteContent[]>;
  deleteNoteSegment(contentId: string): Promise<void>;
  getContentTypesIds(typeName: string): Promise<string>;
  getNotes(): Promise<Note[]>;
  deleteNoteDocument(noteId: string): Promise<void>;
  createNoteDocument(noteId: string, result: GeneratedNote): Promise<void>;
  getNoteDocument(noteId: string): Promise<NoteResultWithTypeName[]>;
}

export interface INoteService {
  createNote(
    title: string,
    instruction: string | null,
  ): Promise<ServiceResponse<Note | null>>;
  getNote(noteId: string): Promise<ServiceResponse<Note | null>>;
  createNoteSummary(
    noteId: string,
  ): Promise<ServiceResponse<NoteResultSummary | null>>;
  getNoteSummary(
    noteId: string,
  ): Promise<ServiceResponse<NoteResultSummary | null>>;
  addNoteContent(
    noteId: string,
    contentType: string,
    content: string,
  ): Promise<ServiceResponse<null>>;
  getNoteSegments(
    noteId: string,
  ): Promise<ServiceResponse<NoteContent[] | null>>;
  deleteNoteSegment(contentId: string): Promise<ServiceResponse<null>>;
  getNotes(): Promise<ServiceResponse<Note[] | null>>;
  createNoteDocument(noteId: string): Promise<ServiceResponse<null>>;
  getNoteDocument(
    noteId: string,
  ): Promise<ServiceResponse<NoteResultWithTypeName[] | null>>;
}

export interface INoteEnhancerService {
  getEnhancedNote(note: Note, contents: NoteContent[]): Promise<GeneratedNote>;
  getNoteSummary(note: Note, contents: NoteContent[]): Promise<string>;
}
