import type { ILoggerFactory } from "@/common/logger";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { INoteService } from "@/common/types/interfaces/note.interface";
import * as httpHandlers from "@/common/utils/httpHandlers";
import { NoteController } from "@/services/note/note.controller";
import type { Request, Response } from "express";
import { MockLoggerFactory } from "tests/unit/mocks/mock.logger";
import { MockNoteService, NOTE_MOCKS } from "tests/unit/mocks/mock.note";
import { mockHandleServiceResponse } from "tests/unit/mocks/mock.utils";

// Mock the entire module
jest.mock("@/common/utils/httpHandlers", () => ({
  handleServiceResponse: jest.fn(),
  validateRequest: jest.fn(),
}));

describe("NoteController", () => {
  let noteController: NoteController;
  let noteService: jest.Mocked<INoteService>;
  let loggerFactory: jest.Mocked<ILoggerFactory>;
  let mockRequest: jest.Mocked<Request>;
  let mockResponse: jest.Mocked<Response>;

  beforeEach(() => {
    noteService = new MockNoteService();
    loggerFactory = new MockLoggerFactory();
    noteController = new NoteController(noteService, loggerFactory);
    mockRequest = {} as jest.Mocked<Request>;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      statusCode: 0,
    } as unknown as jest.Mocked<Response>;
    jest
      .spyOn(httpHandlers, "handleServiceResponse")
      .mockImplementation(mockHandleServiceResponse);
  });

  describe("#createNote", () => {
    it("should call noteService.createNote and handle the response", async () => {
      mockRequest.body = {
        title: NOTE_MOCKS.mockNote.title,
        instruction: NOTE_MOCKS.mockNote.instruction,
      };
      const mockServiceResponse = ServiceResponse.success(
        "Note created",
        NOTE_MOCKS.mockNote,
      );
      noteService.createNote.mockResolvedValue(mockServiceResponse);

      await noteController.createNote(mockRequest, mockResponse);

      expect(noteService.createNote).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.title,
        NOTE_MOCKS.mockNote.instruction,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#getNote", () => {
    it("should call noteService.getNote and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      const mockServiceResponse = ServiceResponse.success(
        "Note retrieved",
        NOTE_MOCKS.mockNote,
      );
      noteService.getNote.mockResolvedValue(mockServiceResponse);

      await noteController.getNote(mockRequest, mockResponse);

      expect(noteService.getNote).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#createNoteSummary", () => {
    it("should call noteService.createNoteSummary and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      const mockServiceResponse = ServiceResponse.success(
        "Summary created",
        NOTE_MOCKS.mockNoteSummary,
      );
      noteService.createNoteSummary.mockResolvedValue(mockServiceResponse);

      await noteController.createNoteSummary(mockRequest, mockResponse);

      expect(noteService.createNoteSummary).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#getNoteSummary", () => {
    it("should call noteService.getNoteSummary and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      const mockServiceResponse = ServiceResponse.success(
        "Summary retrieved",
        NOTE_MOCKS.mockNoteSummary,
      );
      noteService.getNoteSummary.mockResolvedValue(mockServiceResponse);

      await noteController.getNoteSummary(mockRequest, mockResponse);

      expect(noteService.getNoteSummary).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#createNoteSegment", () => {
    it("should call noteService.addNoteContent and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      mockRequest.body = {
        content: NOTE_MOCKS.mockNoteContent.contentText,
        contentType: NOTE_MOCKS.mockNoteContent.contentTypeId,
      };
      const mockServiceResponse = ServiceResponse.success(
        "Segment added",
        null,
      );
      noteService.addNoteContent.mockResolvedValue(mockServiceResponse);

      await noteController.createNoteSegment(mockRequest, mockResponse);

      expect(noteService.addNoteContent).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
        NOTE_MOCKS.mockNoteContent.contentTypeId,
        NOTE_MOCKS.mockNoteContent.contentText,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#getNoteSegments", () => {
    it("should call noteService.getNoteSegments and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      const mockServiceResponse = ServiceResponse.success(
        "Segments retrieved",
        NOTE_MOCKS.mockNoteSegments,
      );
      noteService.getNoteSegments.mockResolvedValue(mockServiceResponse);

      await noteController.getNoteSegments(mockRequest, mockResponse);

      expect(noteService.getNoteSegments).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#deleteNote", () => {
    it("should call noteService.deleteNoteSegment and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      const mockServiceResponse = ServiceResponse.success("Note deleted", null);
      noteService.deleteNoteSegment.mockResolvedValue(mockServiceResponse);

      await noteController.deleteNote(mockRequest, mockResponse);

      expect(noteService.deleteNoteSegment).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#getNotes", () => {
    it("should call noteService.getNotes and handle the response", async () => {
      const mockServiceResponse = ServiceResponse.success(
        "Notes retrieved",
        NOTE_MOCKS.mockNotes,
      );
      noteService.getNotes.mockResolvedValue(mockServiceResponse);

      await noteController.getNotes(mockRequest, mockResponse);

      expect(noteService.getNotes).toHaveBeenCalled();
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#createNoteDocument", () => {
    it("should call noteService.createNoteDocument and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      const mockServiceResponse = ServiceResponse.success(
        "Document created",
        null,
      );
      noteService.createNoteDocument.mockResolvedValue(mockServiceResponse);

      await noteController.createNoteDocument(mockRequest, mockResponse);

      expect(noteService.createNoteDocument).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });

  describe("#getNoteDocument", () => {
    it("should call noteService.getNoteDocument and handle the response", async () => {
      mockRequest.params = { noteId: NOTE_MOCKS.mockNote.noteId };
      const mockServiceResponse = ServiceResponse.success(
        "Document retrieved",
        NOTE_MOCKS.mockNoteResultWithTypeName,
      );
      noteService.getNoteDocument.mockResolvedValue(mockServiceResponse);

      await noteController.getNoteDocument(mockRequest, mockResponse);

      expect(noteService.getNoteDocument).toHaveBeenCalledWith(
        NOTE_MOCKS.mockNote.noteId,
      );
      expect(mockHandleServiceResponse).toHaveBeenCalledWith(
        mockServiceResponse,
        mockResponse,
      );
    });
  });
});
