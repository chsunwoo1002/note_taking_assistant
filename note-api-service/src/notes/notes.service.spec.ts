// notes.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { ContentGenerationService } from 'src/content-generation/content-generation.service';
import { ValidationService } from 'src/validation/validation.service';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindNoteDto } from './dto/find-note.dto';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { FindSummaryDto } from './dto/find-summary.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FindDocumentDto } from './dto/find-document.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { FindContentsDto } from './dto/find-content.dto';
import { BaseNoteDto } from './dto/base-note.dto';
import { DeleteContentDto } from './dto/delete-note-content.dto';

describe('NotesService', () => {
  let service: NotesService;
  let notesRepositoryMock: Partial<NotesRepository>;
  let contentGenerationServiceMock: Partial<ContentGenerationService>;
  let validationServiceMock: Partial<ValidationService>;

  beforeEach(async () => {
    notesRepositoryMock = {
      findAllNotes: jest.fn(),
      createNote: jest.fn(),
      findOneNote: jest.fn(),
      createSummary: jest.fn(),
      findOneSummary: jest.fn(),
      createDocument: jest.fn(),
      findOneDocument: jest.fn(),
      createContent: jest.fn(),
      deleteContent: jest.fn(),
      findAllContents: jest.fn(),
    };

    contentGenerationServiceMock = {
      generateSummary: jest.fn(),
      generateDocument: jest.fn(),
    };

    validationServiceMock = {
      transformAndValidate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: NotesRepository, useValue: notesRepositoryMock },
        {
          provide: ContentGenerationService,
          useValue: contentGenerationServiceMock,
        },
        { provide: ValidationService, useValue: validationServiceMock },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllNotes', () => {
    it('should return all notes for a user', async () => {
      // Arrange
      const user: AuthenticatedUserDto = { userId: 'user123', iat: 0, exp: 0 };
      const notes = [
        { id: 1, title: 'Note 1' },
        { id: 2, title: 'Note 2' },
      ];
      (notesRepositoryMock.findAllNotes as jest.Mock).mockResolvedValue(notes);

      // Act
      const result = await service.findAllNotes(user);

      // Assert
      expect(notesRepositoryMock.findAllNotes).toHaveBeenCalledWith(user);
      expect(result).toBe(notes);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      // Arrange
      const user: AuthenticatedUserDto = { userId: 'user123', iat: 0, exp: 0 };
      const createNoteDto: CreateNoteDto = {
        title: 'New Note',
        instruction: 'New Instruction',
      };
      const createdNote = { id: 1, title: 'New Note' };
      (notesRepositoryMock.createNote as jest.Mock).mockResolvedValue(
        createdNote,
      );

      // Act
      const result = await service.createNote(user, createNoteDto);

      // Assert
      expect(notesRepositoryMock.createNote).toHaveBeenCalledWith(
        user,
        createNoteDto,
      );
      expect(result).toBe(createdNote);
    });
  });

  describe('findOneNote', () => {
    it('should return a single note', async () => {
      // Arrange
      const findNoteDto: FindNoteDto = { noteId: '1' };
      const note = { id: 1, title: 'Note 1' };
      (notesRepositoryMock.findOneNote as jest.Mock).mockResolvedValue(note);

      // Act
      const result = await service.findOneNote(findNoteDto);

      // Assert
      expect(notesRepositoryMock.findOneNote).toHaveBeenCalledWith(findNoteDto);
      expect(result).toBe(note);
    });
  });

  describe('createSummary', () => {
    it('should create a summary for a note', async () => {
      // Arrange
      const createSummaryDto: CreateSummaryDto = { noteId: '1' };
      const noteContentListDto = {
        title: 'Note 1',
        contents: [{ contentText: 'Content 1' }, { contentText: 'Content 2' }],
      };
      const generateSummaryResponseDto = { summary: 'Generated summary' };
      const createdSummary = { id: 1, content: 'Generated summary' };

      (notesRepositoryMock.findAllContents as jest.Mock).mockResolvedValue(
        noteContentListDto,
      );
      (
        contentGenerationServiceMock.generateSummary as jest.Mock
      ).mockResolvedValue(generateSummaryResponseDto);
      (notesRepositoryMock.createSummary as jest.Mock).mockResolvedValue(
        createdSummary,
      );

      // Act
      const result = await service.createSummary(createSummaryDto);

      // Assert
      expect(notesRepositoryMock.findAllContents).toHaveBeenCalledWith(
        createSummaryDto,
      );
      expect(contentGenerationServiceMock.generateSummary).toHaveBeenCalledWith(
        noteContentListDto,
      );
      expect(notesRepositoryMock.createSummary).toHaveBeenCalledWith(
        createSummaryDto,
        generateSummaryResponseDto,
      );
      expect(result).toBe(createdSummary);
    });

    it('should handle errors if content generation fails', async () => {
      // Arrange
      const createSummaryDto: CreateSummaryDto = { noteId: '1' };
      const noteContentListDto = {
        title: 'Note 1',
        contents: [{ contentText: 'Content 1' }, { contentText: 'Content 2' }],
      };
      const error = new Error('Content generation failed');

      (notesRepositoryMock.findAllContents as jest.Mock).mockResolvedValue(
        noteContentListDto,
      );
      (
        contentGenerationServiceMock.generateSummary as jest.Mock
      ).mockRejectedValue(error);

      // Act & Assert
      await expect(service.createSummary(createSummaryDto)).rejects.toThrow(
        error,
      );
      expect(notesRepositoryMock.findAllContents).toHaveBeenCalledWith(
        createSummaryDto,
      );
      expect(contentGenerationServiceMock.generateSummary).toHaveBeenCalledWith(
        noteContentListDto,
      );
      expect(notesRepositoryMock.createSummary).not.toHaveBeenCalled();
    });
  });

  describe('findOneSummary', () => {
    it('should return a summary for a note', async () => {
      // Arrange
      const findSummaryDto: FindSummaryDto = { noteId: '1' };
      const summary = { id: 1, content: 'Summary content' };

      (notesRepositoryMock.findOneSummary as jest.Mock).mockResolvedValue(
        summary,
      );

      // Act
      const result = await service.findOneSummary(findSummaryDto);

      // Assert
      expect(notesRepositoryMock.findOneSummary).toHaveBeenCalledWith(
        findSummaryDto,
      );
      expect(result).toBe(summary);
    });
  });

  describe('createDocument', () => {
    it('should create a document for a note', async () => {
      // Arrange
      const createDocumentDto: CreateDocumentDto = { noteId: '1' };
      const noteContentListDto = {
        title: 'Note 1',
        contents: [{ contentText: 'Content 1' }, { contentText: 'Content 2' }],
      };
      const generateDocumentResponseDto = {
        contents: [{ type: 'paragraph', content: 'Generated content' }],
      };
      const createdDocument = {
        id: 1,
        contents: generateDocumentResponseDto.contents,
      };

      (notesRepositoryMock.findAllContents as jest.Mock).mockResolvedValue(
        noteContentListDto,
      );
      (
        contentGenerationServiceMock.generateDocument as jest.Mock
      ).mockResolvedValue(generateDocumentResponseDto);
      (notesRepositoryMock.createDocument as jest.Mock).mockResolvedValue(
        createdDocument,
      );

      // Act
      const result = await service.createDocument(createDocumentDto);

      // Assert
      expect(notesRepositoryMock.findAllContents).toHaveBeenCalledWith(
        createDocumentDto,
      );
      expect(
        contentGenerationServiceMock.generateDocument,
      ).toHaveBeenCalledWith(noteContentListDto);
      expect(notesRepositoryMock.createDocument).toHaveBeenCalledWith(
        createDocumentDto,
        generateDocumentResponseDto,
      );
      expect(result).toBe(createdDocument);
    });

    it('should handle errors if content generation fails', async () => {
      // Arrange
      const createDocumentDto: CreateDocumentDto = { noteId: '1' };
      const noteContentListDto = {
        title: 'Note 1',
        contents: [{ contentText: 'Content 1' }, { contentText: 'Content 2' }],
      };
      const error = new Error('Content generation failed');

      (notesRepositoryMock.findAllContents as jest.Mock).mockResolvedValue(
        noteContentListDto,
      );
      (
        contentGenerationServiceMock.generateDocument as jest.Mock
      ).mockRejectedValue(error);

      // Act & Assert
      await expect(service.createDocument(createDocumentDto)).rejects.toThrow(
        error,
      );
      expect(notesRepositoryMock.findAllContents).toHaveBeenCalledWith(
        createDocumentDto,
      );
      expect(
        contentGenerationServiceMock.generateDocument,
      ).toHaveBeenCalledWith(noteContentListDto);
      expect(notesRepositoryMock.createDocument).not.toHaveBeenCalled();
    });
  });

  describe('findOneDocument', () => {
    it('should return a document for a note', async () => {
      // Arrange
      const findDocumentDto: FindDocumentDto = { noteId: '1' };
      const document = {
        id: 1,
        contents: [{ type: 'paragraph', content: 'Document content' }],
      };

      (notesRepositoryMock.findOneDocument as jest.Mock).mockResolvedValue(
        document,
      );

      // Act
      const result = await service.findOneDocument(findDocumentDto);

      // Assert
      expect(notesRepositoryMock.findOneDocument).toHaveBeenCalledWith(
        findDocumentDto,
      );
      expect(result).toBe(document);
    });
  });

  describe('createContent', () => {
    it('should create content for a note', async () => {
      // Arrange
      const baseNoteDto: BaseNoteDto = { noteId: '1' };
      const createContentDto: CreateContentDto = {
        contentType: 'text',
        contentText: 'New content',
      };
      const content = { id: 1, contentText: 'New content' };

      (notesRepositoryMock.createContent as jest.Mock).mockResolvedValue(
        content,
      );

      // Act
      const result = await service.createContent(baseNoteDto, createContentDto);

      // Assert
      expect(notesRepositoryMock.createContent).toHaveBeenCalledWith(
        baseNoteDto,
        createContentDto,
      );
      expect(result).toBe(content);
    });
  });

  describe('findAllContents', () => {
    it('should return all contents for a note', async () => {
      // Arrange
      const findContentsDto: FindContentsDto = { noteId: '1' };
      const contents = [
        { id: 1, contentText: 'Content 1' },
        { id: 2, contentText: 'Content 2' },
      ];

      (notesRepositoryMock.findAllContents as jest.Mock).mockResolvedValue(
        contents,
      );

      // Act
      const result = await service.findAllContents(findContentsDto);

      // Assert
      expect(notesRepositoryMock.findAllContents).toHaveBeenCalledWith(
        findContentsDto,
      );
      expect(result).toBe(contents);
    });
  });

  describe('deleteContent', () => {
    it('should delete content for a note', async () => {
      // Arrange
      const deleteContentDto: DeleteContentDto = {
        contentId: '2',
      };

      (notesRepositoryMock.deleteContent as jest.Mock).mockResolvedValue(
        undefined,
      );

      // Act
      const result = await service.deleteContent(deleteContentDto);

      // Assert
      expect(notesRepositoryMock.deleteContent).toHaveBeenCalledWith(
        deleteContentDto,
      );
      expect(result).toBe(undefined);
    });

    it('should handle errors if content deletion fails', async () => {
      // Arrange
      const deleteContentDto: DeleteContentDto = {
        contentId: '2',
      };
      const error = new Error('Content deletion failed');

      (notesRepositoryMock.deleteContent as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(service.deleteContent(deleteContentDto)).rejects.toThrow(
        error,
      );
      expect(notesRepositoryMock.deleteContent).toHaveBeenCalledWith(
        deleteContentDto,
      );
    });
  });
});
