import type { ILogger, ILoggerFactory } from "@/common/logger";
import type {
  INoteEnhancerService,
  INoteRepository,
  INoteService,
} from "@/common/types/interfaces/note.interface";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { NoteService } from "@/services/note/note.service";
import { TestBed } from "@automock/jest";
import { StatusCodes } from "http-status-codes";
import { MockLogger } from "tests/unit/mocks/mock.logger";
import { NOTE_MOCKS } from "tests/unit/mocks/mock.note";

describe("NoteService", () => {
  let noteService: INoteService;
  let noteRepository: jest.Mocked<INoteRepository>;
  let noteEnhancerService: jest.Mocked<INoteEnhancerService>;
  let logger: jest.Mocked<ILogger>;

  beforeAll(() => {
    logger = new MockLogger();

    const { unit, unitRef } = TestBed.create<INoteService>(NoteService)
      .mock<ILoggerFactory>(DEPENDENCY_IDENTIFIERS.LoggerFactory)
      .using({
        createLogger: jest.fn().mockReturnValue(logger),
      })
      .compile();

    noteService = unit;
    noteRepository = unitRef.get<INoteRepository>(
      DEPENDENCY_IDENTIFIERS.NoteRepository,
    );
    noteEnhancerService = unitRef.get<INoteEnhancerService>(
      DEPENDENCY_IDENTIFIERS.NoteEnhancerService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNote", () => {
    it("should create a note successfully", async () => {
      noteRepository.createNote.mockResolvedValue(NOTE_MOCKS.mockNote);

      const result = await noteService.createNote("Test Note", null);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(NOTE_MOCKS.mockNote);
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when creating a note", async () => {
      const error = new Error("Database error");
      noteRepository.createNote.mockRejectedValue(error);

      const result = await noteService.createNote(
        NOTE_MOCKS.mockNoteTitle,
        null,
      );

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.data).toEqual(null);
      expect(result.message).toBe("An error occurred while creating note.");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getNote", () => {
    it("should get a note successfully", async () => {
      noteRepository.getNote.mockResolvedValue(NOTE_MOCKS.mockNote);

      const result = await noteService.getNote(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(NOTE_MOCKS.mockNote);
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when getting a note", async () => {
      const error = new Error("Database error");
      noteRepository.getNote.mockRejectedValue(error);

      const result = await noteService.getNote("noteId");

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe("An error occurred while getting note.");
    });
  });

  describe("createNoteSummary", () => {
    it("should create a note summary successfully", async () => {
      noteRepository.getNote.mockResolvedValue(NOTE_MOCKS.mockNote);
      noteRepository.getNoteSegments.mockResolvedValue(
        NOTE_MOCKS.mockNoteSegments,
      );
      noteRepository.deleteNoteSummary.mockResolvedValue(undefined);
      noteEnhancerService.getNoteSummary.mockResolvedValue(
        NOTE_MOCKS.mockNoteSummary.content,
      );
      noteRepository.createNoteSummary.mockResolvedValue(
        NOTE_MOCKS.mockNoteSummary,
      );

      const result = await noteService.createNoteSummary(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(NOTE_MOCKS.mockNoteSummary);
      expect(result.message).toBe("Note found");
      expect(noteRepository.getNote).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteRepository.getNoteSegments).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteRepository.deleteNoteSummary).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteEnhancerService.getNoteSummary).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote,
        NOTE_MOCKS.mockNoteSegments,
      );
      expect(noteRepository.createNoteSummary).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
        NOTE_MOCKS.mockNoteSummary.content,
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it("should return null when no contents found", async () => {
      noteRepository.getNote.mockResolvedValue(NOTE_MOCKS.mockNote);
      noteRepository.getNoteSegments.mockResolvedValue([]);
      noteRepository.deleteNoteSummary.mockResolvedValue(undefined);
      noteEnhancerService.getNoteSummary.mockResolvedValue(
        NOTE_MOCKS.mockNoteSummary.content,
      );
      noteRepository.createNoteSummary.mockResolvedValue(
        NOTE_MOCKS.mockNoteSummary,
      );

      const result = await noteService.createNoteSummary(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.message).toBe("No contents found for note.");
      expect(noteRepository.getNote).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteRepository.getNoteSegments).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteRepository.deleteNoteSummary).not.toHaveBeenCalled();
      expect(noteEnhancerService.getNoteSummary).not.toHaveBeenCalled();
      expect(noteRepository.createNoteSummary).not.toHaveBeenCalled();
    });

    it("should handle errors when creating a note summary", async () => {
      const error = new Error("Database error");
      noteRepository.getNote.mockRejectedValue(error);

      const result = await noteService.createNoteSummary(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(
        "An error occurred while getting note summary.",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getNoteSummary", () => {
    it("should get a note summary successfully", async () => {
      noteRepository.getNoteSummary.mockResolvedValue(
        NOTE_MOCKS.mockNoteSummary,
      );

      const result = await noteService.getNoteSummary(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(NOTE_MOCKS.mockNoteSummary);
      expect(result.message).toBe("Note found");
      expect(noteRepository.getNoteSummary).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when getting a note summary", async () => {
      const error = new Error("Database error");
      noteRepository.getNoteSummary.mockRejectedValue(error);

      const result = await noteService.getNoteSummary(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(
        "An error occurred while getting note summary.",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("addNoteContent", () => {
    it("should add note content successfully", async () => {
      noteRepository.getContentTypesIds.mockResolvedValue(
        NOTE_MOCKS.mockContentTypeId,
      );
      noteRepository.addNoteSegment.mockResolvedValue(undefined);

      const result = await noteService.addNoteContent(
        NOTE_MOCKS.mockNoteId,
        NOTE_MOCKS.mockContentType,
        NOTE_MOCKS.mockNoteContent.contentText,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.message).toBe("Note updated");
      expect(noteRepository.getContentTypesIds).toHaveBeenCalledWith(
        NOTE_MOCKS.mockContentType,
      );
      expect(noteRepository.addNoteSegment).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
        NOTE_MOCKS.mockContentTypeId,
        NOTE_MOCKS.mockNoteContent.contentText,
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when adding note content", async () => {
      const error = new Error("Database error");
      noteRepository.getContentTypesIds.mockRejectedValue(error);

      const result = await noteService.addNoteContent(
        NOTE_MOCKS.mockNoteId,
        NOTE_MOCKS.mockContentType,
        NOTE_MOCKS.mockNoteContent.contentText,
      );

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(
        "An error occurred while adding content to note.",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getNoteSegments", () => {
    it("should get note segments successfully", async () => {
      noteRepository.getNoteSegments.mockResolvedValue(
        NOTE_MOCKS.mockNoteSegments,
      );

      const result = await noteService.getNoteSegments(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(NOTE_MOCKS.mockNoteSegments);
      expect(result.message).toBe("Note found");
      expect(noteRepository.getNoteSegments).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when getting note segments", async () => {
      const error = new Error("Database error");
      noteRepository.getNoteSegments.mockRejectedValue(error);

      const result = await noteService.getNoteSegments(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe("An error occurred while getting note.");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteNoteSegment", () => {
    it("should delete a note segment successfully", async () => {
      noteRepository.deleteNoteSegment.mockResolvedValue(undefined);

      const result = await noteService.deleteNoteSegment(
        NOTE_MOCKS.mockContentId,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.message).toBe("Note segment deleted");
      expect(noteRepository.deleteNoteSegment).toHaveBeenCalledWith(
        NOTE_MOCKS.mockContentId,
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when deleting a note segment", async () => {
      const error = new Error("Database error");
      noteRepository.deleteNoteSegment.mockRejectedValue(error);

      const result = await noteService.deleteNoteSegment(
        NOTE_MOCKS.mockContentId,
      );

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(
        "An error occurred while deleting note segment.",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getNotes", () => {
    it("should get notes successfully", async () => {
      noteRepository.getNotes.mockResolvedValue(NOTE_MOCKS.mockNotes);

      const result = await noteService.getNotes();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(NOTE_MOCKS.mockNotes);
      expect(result.message).toBe("Notes found");
      expect(noteRepository.getNotes).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when getting notes", async () => {
      const error = new Error("Database error");
      noteRepository.getNotes.mockRejectedValue(error);

      const result = await noteService.getNotes();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe("An error occurred while getting notes.");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createNoteDocument", () => {
    it("should create a note document successfully", async () => {
      noteRepository.getNote.mockResolvedValue(NOTE_MOCKS.mockNote);
      noteRepository.getNoteSegments.mockResolvedValue(
        NOTE_MOCKS.mockNoteSegments,
      );
      noteRepository.deleteNoteDocument.mockResolvedValue(undefined);
      noteRepository.createNoteDocument.mockResolvedValue(undefined);
      noteEnhancerService.getEnhancedNote.mockResolvedValue(
        NOTE_MOCKS.mockGeneratedNote,
      );

      const result = await noteService.createNoteDocument(
        NOTE_MOCKS.mockNoteId,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.message).toBe("Note result created");
      expect(noteRepository.getNote).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteRepository.getNoteSegments).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteRepository.deleteNoteDocument).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(noteRepository.createNoteDocument).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
        NOTE_MOCKS.mockGeneratedNote,
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it("should not create a note document if no contents are found", async () => {
      noteRepository.getNote.mockResolvedValue(NOTE_MOCKS.mockNote);
      noteRepository.getNoteSegments.mockResolvedValue([]);

      const result = await noteService.createNoteDocument(
        NOTE_MOCKS.mockNoteId,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.message).toBe("No contents found for note.");
      expect(noteEnhancerService.getEnhancedNote).not.toHaveBeenCalled();
      expect(noteRepository.deleteNoteDocument).not.toHaveBeenCalled();
      expect(noteRepository.createNoteDocument).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });

    it("should handle errors when creating a note document", async () => {
      const error = new Error("Database error");
      noteRepository.getNote.mockRejectedValue(error);

      const result = await noteService.createNoteDocument(
        NOTE_MOCKS.mockNoteId,
      );

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(
        "An error occurred while getting note result.",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getNoteDocument", () => {
    it("should get a note document successfully", async () => {
      noteRepository.getNoteDocument.mockResolvedValue(
        NOTE_MOCKS.mockNoteResultWithTypeName,
      );

      const result = await noteService.getNoteDocument(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(NOTE_MOCKS.mockNoteResultWithTypeName);
      expect(result.message).toBe("Note document found");
      expect(noteRepository.getNoteDocument).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNoteId,
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle errors when getting a note document", async () => {
      const error = new Error("Database error");
      noteRepository.getNoteDocument.mockRejectedValue(error);

      const result = await noteService.getNoteDocument(NOTE_MOCKS.mockNoteId);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(
        "An error occurred while getting note document.",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
