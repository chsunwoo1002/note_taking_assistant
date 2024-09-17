import { Injectable } from '@nestjs/common';

import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindNoteDto } from './dto/find-note.dto';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { FindSummaryDto } from './dto/find-summary.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FindDocumentDto } from './dto/find-document.dto';
import { ContentGenerationService } from 'src/content-generation/content-generation.service';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { FindContentsDto } from './dto/find-content.dto';
import { ValidationService } from 'src/validation/validation.service';
import { BaseNoteDto } from './dto/base-note.dto';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly contentGenerationService: ContentGenerationService,
    private readonly validationService: ValidationService,
  ) {}

  findAllNotes(user: AuthenticatedUserDto) {
    return this.notesRepository.findAllNotes(user);
  }

  createNote(user: AuthenticatedUserDto, createNoteDto: CreateNoteDto) {
    return this.notesRepository.createNote(user, createNoteDto);
  }

  findOneNote(findNoteDto: FindNoteDto) {
    return this.notesRepository.findOneNote(findNoteDto);
  }

  async createSummary(createSummaryDto: CreateSummaryDto) {
    const noteContentListDto =
      await this.notesRepository.findAllContents(createSummaryDto);

    const generateSummaryResponseDto =
      await this.contentGenerationService.generateSummary(noteContentListDto);

    return this.notesRepository.createSummary(
      createSummaryDto,
      generateSummaryResponseDto,
    );
  }

  findOneSummary(findSummaryDto: FindSummaryDto) {
    return this.notesRepository.findOneSummary(findSummaryDto);
  }

  async createDocument(createDocumentDto: CreateDocumentDto) {
    const noteContentListDto =
      await this.notesRepository.findAllContents(createDocumentDto);

    const generateDocumentResponseDto =
      await this.contentGenerationService.generateDocument(noteContentListDto);
    return this.notesRepository.createDocument(
      createDocumentDto,
      generateDocumentResponseDto,
    );
  }

  findOneDocument(findDocumentDto: FindDocumentDto) {
    return this.notesRepository.findOneDocument(findDocumentDto);
  }

  createContent(baseNoteDto: BaseNoteDto, createContentDto: CreateContentDto) {
    return this.notesRepository.createContent(baseNoteDto, createContentDto);
  }

  findAllContents(findContentsDto: FindContentsDto) {
    return this.notesRepository.findAllContents(findContentsDto);
  }
}
