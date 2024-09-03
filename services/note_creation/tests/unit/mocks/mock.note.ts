import type {
  INoteEnhancerService,
  INoteRepository,
  INoteService,
} from "@/common/types/interfaces/note.interface";
import type {
  Note,
  NoteContent,
  NoteResult,
  NoteResultSummary,
} from "@/common/types/types/db.types";
import type { GeneratedNote } from "@/common/types/types/note.types";

const mockNoteId = "mock-id";
const mockNoteTitle = "Mock Note";
const mockContentType = "text";
const mockContentTypeId = "content-type-id";
const mockContentId = "content-id";
const mockNote: Note = {
  noteId: mockNoteId,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: mockNoteTitle,
  instruction: null,
};

const mockNoteContent: NoteContent = {
  contentId: mockContentId,
  noteId: mockNoteId,
  createdAt: new Date(),
  contentTypeId: "text",
  contentText: "Mock content",
  fileUrl: null,
  timestamp: null,
  sourceUrl: null,
};

const mockNoteSummary: NoteResultSummary = {
  summaryId: "summary-id",
  noteId: mockNoteId,
  createdAt: new Date(),
  updatedAt: new Date(),
  content: "Mock content",
};

const mockNoteDocument: NoteResult[] = [
  {
    resultId: "result-id",
    noteId: mockNoteId,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: "Mock content",
    fileUrl: null,
    resultTypeId: "text",
    orderIndex: 0,
  },
];

const mockGeneratedNote: GeneratedNote = {
  contents: [
    { type: "heading1", content: "Sample Heading 1" },
    { type: "paragraph", content: "This is a sample paragraph content." },
    { type: "heading2", content: "Sample Heading 2" },
    { type: "paragraph", content: "Another sample paragraph with some text." },
  ],
};

const mockNoteSegments: NoteContent[] = [mockNoteContent];
const mockNotes: Note[] = [mockNote];

export const NOTE_MOCKS = {
  mockNote,
  mockNoteContent,
  mockNoteSummary,
  mockNoteSegments,
  mockNoteTitle,
  mockNoteId,
  mockContentType,
  mockContentTypeId,
  mockContentId,
  mockGeneratedNote,
  mockNotes,
  mockNoteDocument,
};

export class MockNoteService implements INoteService {
  createNote = jest.fn();
  getNote = jest.fn();
  createNoteSummary = jest.fn();
  getNoteSummary = jest.fn();
  addNoteContent = jest.fn();
  getNoteSegments = jest.fn();
  deleteNoteSegment = jest.fn();
  getNotes = jest.fn();
  createNoteDocument = jest.fn();
  getNoteDocument = jest.fn();
}

export class MockNoteRepository implements INoteRepository {
  getContentTypesIds(typeName: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getNotes(): Promise<Note[]> {
    throw new Error("Method not implemented.");
  }
  deleteNoteDocument(noteId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createNoteDocument(noteId: string, result: GeneratedNote): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getNoteDocument(noteId: string): Promise<NoteResult[]> {
    throw new Error("Method not implemented.");
  }
  createNote = jest.fn();
  getNote = jest.fn();
  createNoteSummary = jest.fn();
  getNoteSummary = jest.fn();
  deleteNoteSummary = jest.fn();
  addNoteSegment = jest.fn();
  getNoteSegments = jest.fn();
  deleteNoteSegment = jest.fn();
}

export class MockNoteEnhancerService implements INoteEnhancerService {
  getEnhancedNote = jest.fn();
  getNoteSummary = jest.fn();
}
