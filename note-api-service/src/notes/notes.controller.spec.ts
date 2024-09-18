// notes.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindNoteDto } from './dto/find-note.dto';
import { FindSummaryDto } from './dto/find-summary.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FindDocumentDto } from './dto/find-document.dto';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { FindContentsDto } from './dto/find-content.dto';
import { BaseNoteDto } from './dto/base-note.dto';
import { DeleteContentDto } from './dto/delete-note-content.dto';

describe('NotesController', () => {
  let controller: NotesController;
  let notesServiceMock: Partial<NotesService>;

  beforeEach(async () => {
    notesServiceMock = {
      findAllNotes: jest.fn(),
      createNote: jest.fn(),
      findOneNote: jest.fn(),
      createSummary: jest.fn(),
      findOneSummary: jest.fn(),
      createDocument: jest.fn(),
      findOneDocument: jest.fn(),
      createContent: jest.fn(),
      findAllContents: jest.fn(),
      deleteContent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: notesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllNotes', () => {
    it('should return an array of notes', async () => {
      // Arrange
      const user: AuthenticatedUserDto = { userId: 'user123', iat: 0, exp: 0 };
      const notes = [
        { id: 1, title: 'Note 1' },
        { id: 2, title: 'Note 2' },
      ];

      (notesServiceMock.findAllNotes as jest.Mock).mockResolvedValue(notes);

      // Act
      const result = await controller.findAllNotes(user);

      // Assert
      expect(notesServiceMock.findAllNotes).toHaveBeenCalledWith(user);
      expect(result).toBe(notes);
    });
  });

  describe('createNote', () => {
    it('should create a new note and return it', async () => {
      // Arrange
      const user: AuthenticatedUserDto = { userId: 'user123', iat: 0, exp: 0 };
      const createNoteDto: CreateNoteDto = {
        title: 'New Note',
        instruction: 'Generate a summary of the following note.',
      };
      const createdNote = { id: 1, title: 'New Note' };

      (notesServiceMock.createNote as jest.Mock).mockResolvedValue(createdNote);

      // Act
      const result = await controller.createNote(user, createNoteDto);

      // Assert
      expect(notesServiceMock.createNote).toHaveBeenCalledWith(
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

      (notesServiceMock.findOneNote as jest.Mock).mockResolvedValue(note);

      // Act
      const result = await controller.findOneNote(findNoteDto);

      // Assert
      expect(notesServiceMock.findOneNote).toHaveBeenCalledWith(findNoteDto);
      expect(result).toBe(note);
    });
  });

  describe('createSummary', () => {
    it('should create a summary for a note', async () => {
      // Arrange
      const createSummaryDto: CreateSummaryDto = { noteId: '1' };
      const summary = { id: 1, content: 'Summary content' };

      (notesServiceMock.createSummary as jest.Mock).mockResolvedValue(summary);

      // Act
      const result = await controller.createSummary(createSummaryDto);

      // Assert
      expect(notesServiceMock.createSummary).toHaveBeenCalledWith(
        createSummaryDto,
      );
      expect(result).toBe(summary);
    });
  });

  describe('findOneSummary', () => {
    it('should return a summary for a note', async () => {
      // Arrange
      const findSummaryDto: FindSummaryDto = { noteId: '1' };
      const summary = { id: 1, content: 'Summary content' };

      (notesServiceMock.findOneSummary as jest.Mock).mockResolvedValue(summary);

      // Act
      const result = await controller.findOneSummary(findSummaryDto);

      // Assert
      expect(notesServiceMock.findOneSummary).toHaveBeenCalledWith(
        findSummaryDto,
      );
      expect(result).toBe(summary);
    });
  });

  describe('createDocument', () => {
    it('should create a document for a note', async () => {
      // Arrange
      const createDocumentDto: CreateDocumentDto = { noteId: '1' };
      const document = { id: 1, content: 'Document content' };

      (notesServiceMock.createDocument as jest.Mock).mockResolvedValue(
        document,
      );

      // Act
      const result = await controller.createDocument(createDocumentDto);

      // Assert
      expect(notesServiceMock.createDocument).toHaveBeenCalledWith(
        createDocumentDto,
      );
      expect(result).toBe(document);
    });
  });

  describe('findOneDocument', () => {
    it('should return a document for a note', async () => {
      // Arrange
      const findDocumentDto: FindDocumentDto = { noteId: '1' };
      const document = { id: 1, content: 'Document content' };

      (notesServiceMock.findOneDocument as jest.Mock).mockResolvedValue(
        document,
      );

      // Act
      const result = await controller.findOneDocument(findDocumentDto);

      // Assert
      expect(notesServiceMock.findOneDocument).toHaveBeenCalledWith(
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

      (notesServiceMock.createContent as jest.Mock).mockResolvedValue(content);

      // Act
      const result = await controller.createContent(
        baseNoteDto,
        createContentDto,
      );

      // Assert
      expect(notesServiceMock.createContent).toHaveBeenCalledWith(
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

      (notesServiceMock.findAllContents as jest.Mock).mockResolvedValue(
        contents,
      );

      // Act
      const result = await controller.findAllContents(findContentsDto);

      // Assert
      expect(notesServiceMock.findAllContents).toHaveBeenCalledWith(
        findContentsDto,
      );
      expect(result).toBe(contents);
    });
  });

  describe('deleteContent', () => {
    it('should delete content and return no content', async () => {
      // Arrange
      const deleteContentDto: DeleteContentDto = { contentId: '1' };
      (notesServiceMock.deleteContent as jest.Mock).mockResolvedValue(
        undefined,
      );

      // Act
      const result = await controller.deleteContent(deleteContentDto);

      // Assert
      expect(notesServiceMock.deleteContent).toHaveBeenCalledWith(
        deleteContentDto,
      );
      expect(result).toBeUndefined();
    });
  });
});
