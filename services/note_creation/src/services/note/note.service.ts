import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { Logger, LoggerFactory } from "@/common/logger";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type {
  Note,
  NoteContent,
  NoteResultSummary,
} from "@/common/types/types/db.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import type { NoteRepository } from "./note.repository";
import type { NoteEnhancerService } from "./noteEnhencer.service";

@injectable()
export class NoteService {
  private readonly logger: Logger;

  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.NoteRepository)
    private readonly noteRepository: NoteRepository,
    @inject(DEPENDENCY_IDENTIFIERS.LoggerFactory)
    private readonly loggerFactory: LoggerFactory,
    @inject(DEPENDENCY_IDENTIFIERS.NoteEnhancerService)
    private readonly noteEnhancerService: NoteEnhancerService,
  ) {
    this.logger = this.loggerFactory.createLogger("SERVICE_NOTE");
  }

  // Retrieves all users from the database
  async createNote(
    title: string,
    instruction: string | null,
  ): Promise<ServiceResponse<Note | null>> {
    try {
      const note = await this.noteRepository.createNote(title, instruction);
      this.logger.info(note, "Note created");

      return ServiceResponse.success<Note>("Note created", note);
    } catch (ex) {
      const errorMessage = `Error creating note: $${(ex as Error).message}`;
      console.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating note.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNote(noteId: string): Promise<ServiceResponse<Note | null>> {
    try {
      const note = await this.noteRepository.getNote(noteId);
      this.logger.info(note, "Note found");
      return ServiceResponse.success<Note>("Note found", note);
    } catch (ex) {
      const errorMessage = `Error getting note: $${(ex as Error).message}`;
      this.logger.error(ex, errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting note.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNoteSummary(
    noteId: string,
  ): Promise<ServiceResponse<NoteResultSummary | null>> {
    try {
      const note = await this.noteRepository.getNote(noteId);
      const contents = await this.noteRepository.getNoteSegments(noteId);
      if (!contents) {
        return ServiceResponse.success<null>(
          "No contents found for note.",
          null,
        );
      }
      await this.noteRepository.deleteNoteSummary(noteId);
      const summaryText = await this.noteEnhancerService.getNoteSummary(
        note,
        contents,
      );
      const summary = await this.noteRepository.createNoteSummary(
        noteId,
        summaryText,
      );
      this.logger.info(summary, "Note found");
      return ServiceResponse.success<NoteResultSummary>("Note found", summary);
    } catch (ex) {
      const errorMessage = `Error getting note: $${(ex as Error).message}`;
      this.logger.error(ex, errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting note.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNoteSummary(
    noteId: string,
  ): Promise<ServiceResponse<NoteResultSummary | null>> {
    try {
      const summary = await this.noteRepository.getNoteSummary(noteId);
      this.logger.info(summary, "Note found");
      return ServiceResponse.success<NoteResultSummary | null>(
        "Note found",
        summary,
      );
    } catch (ex) {
      const errorMessage = `Error getting note: $${(ex as Error).message}`;
      this.logger.error(ex, errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting note.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addNoteContent(
    noteId: string,
    contentType: string,
    content: string,
  ): Promise<ServiceResponse<null>> {
    try {
      const contentTypeId =
        await this.noteRepository.getContentTypesIds(contentType);
      await this.noteRepository.addNoteSegment(noteId, contentTypeId, content);
      this.logger.info({ noteId, contentTypeId, content }, "content added");

      return ServiceResponse.success<null>("Note updated", null);
    } catch (ex) {
      const errorMessage = `Error adding content to note: $${
        (ex as Error).message
      }`;
      this.logger.error(ex, errorMessage);
      return ServiceResponse.failure(
        "An error occurred while adding content to note.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNoteSegments(
    noteId: string,
  ): Promise<ServiceResponse<NoteContent[] | null>> {
    try {
      const note = await this.noteRepository.getNoteSegments(noteId);
      this.logger.info(note, "Note found");
      return ServiceResponse.success<NoteContent[]>("Note found", note);
    } catch (ex) {
      const errorMessage = `Error getting note: $${(ex as Error).message}`;
      this.logger.error(ex, errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting note.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteNoteSegment(contentId: string): Promise<ServiceResponse<null>> {
    try {
      await this.noteRepository.deleteNoteSegment(contentId);
      return ServiceResponse.success<null>("Note segment deleted", null);
    } catch (ex) {
      this.logger.error(ex, "Error deleting note segment");
      return ServiceResponse.failure(
        "An error occurred while deleting note segment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNotes(): Promise<ServiceResponse<Note[] | null>> {
    try {
      const notes = await this.noteRepository.getNotes();
      return ServiceResponse.success<Note[]>("Notes found", notes);
    } catch (ex) {
      this.logger.error(ex, "Error getting notes");
      return ServiceResponse.failure(
        "An error occurred while getting notes.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNoteDocument(
    noteId: string,
  ): Promise<ServiceResponse<any | null>> {
    try {
      const note = await this.noteRepository.getNote(noteId);
      const contents = await this.noteRepository.getNoteSegments(noteId);
      if (!contents) {
        return ServiceResponse.success<null>(
          "No contents found for note.",
          null,
        );
      }
      const generatedNote = await this.noteEnhancerService.getEnhancedNote(
        note,
        contents,
      );
      await this.noteRepository.deleteNoteDocument(noteId);
      const noteResult = await this.noteRepository.createNoteDocument(
        noteId,
        generatedNote,
      );
      this.logger.info({ noteId }, "Note result created");
      return ServiceResponse.success("Note result created", noteResult);
    } catch (ex) {
      this.logger.error(ex, "Error getting note result");
      return ServiceResponse.failure(
        "An error occurred while getting note result.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNoteDocument(noteId: string): Promise<ServiceResponse<any | null>> {
    try {
      const noteResult = await this.noteRepository.getNoteDocument(noteId);
      this.logger.info(noteResult[0], "Note result found");
      return ServiceResponse.success("Note result found", noteResult);
    } catch (ex) {
      this.logger.error(ex, "Error getting note result");
      return ServiceResponse.failure(
        "An error occurred while getting note result.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
