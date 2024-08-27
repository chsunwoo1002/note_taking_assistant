import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { Logger, LoggerFactory } from "@/common/logger";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { Note } from "@/common/types/types/db.types";
import type { GeneratedNote } from "@/common/types/types/note.types";
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

  async getNote(
    note_id: string,
  ): Promise<ServiceResponse<GeneratedNote | null>> {
    try {
      const note = await this.noteRepository.getNote(note_id);
      this.logger.info(note, "Note found");
      const noteContent = await this.noteRepository.getNoteContent(note_id);
      this.logger.info({ noteContent, note_id }, "Note content found");
      const enhancedContent = await this.noteEnhancerService.getEnhancedNote(
        note,
        noteContent,
      );

      await this.noteRepository.createNoteResult(note_id, enhancedContent);
      return ServiceResponse.success<GeneratedNote>(
        "Note found",
        enhancedContent,
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
    note_id: string,
    content_type: string,
    content: string,
  ): Promise<ServiceResponse<null>> {
    try {
      const content_type_id =
        await this.noteRepository.getContentTypesIds(content_type);
      await this.noteRepository.updateNote(note_id, content_type_id, content);
      this.logger.info({ note_id, content_type_id, content }, "content added");

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

  async getNoteResult(note_id: string): Promise<ServiceResponse<any | null>> {
    try {
      const noteResult = await this.noteRepository.getNoteResult(note_id);
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
