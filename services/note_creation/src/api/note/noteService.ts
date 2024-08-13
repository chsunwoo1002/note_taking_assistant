import { StatusCodes } from "http-status-codes";

import type { Note } from "@/api/note/noteModel";
import { NoteRepository } from "@/api/note/noteRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class NoteService {
  private noteRepository: NoteRepository;

  constructor(repository: NoteRepository = new NoteRepository()) {
    this.noteRepository = repository;
  }

  // Retrieves all users from the database
  async createNote(): Promise<ServiceResponse<Note[] | null>> {
    try {
      const notes = await this.noteRepository.findAllAsync();
      if (!notes || notes.length === 0) {
        return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Note[]>("Notes found", notes);
    } catch (ex) {
      const errorMessage = `Error finding all notes: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: string): Promise<ServiceResponse<Note | null>> {
    try {
      const note = await this.noteRepository.findByIdAsync(id);
      if (!note) {
        return ServiceResponse.failure("Note not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Note>("Note found", note);
    } catch (ex) {
      const errorMessage = `Error finding note with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async addContent(id: string, content: string): Promise<ServiceResponse<Note | null>> {
    try {
      const note = await this.noteRepository.findByIdAsync(id);
      if (!note) {
        return ServiceResponse.failure("Note not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Note>("Note found", note);
    } catch (ex) {
      const errorMessage = `Error finding note with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding note.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const noteService = new NoteService();
