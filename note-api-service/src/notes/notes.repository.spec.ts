// notes.repository.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { NotesRepository } from './notes.repository';
import { DatabaseService } from 'src/database/database.service';
import { ValidationService } from 'src/validation/validation.service';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindNoteDto } from './dto/find-note.dto';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { FindSummaryDto } from './dto/find-summary.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FindDocumentDto } from './dto/find-document.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { BaseNoteDto } from './dto/base-note.dto';
import { GenerateSummaryDto } from 'src/content-generation/dto/generate-summary.dto';
import { GenerateDocumentDto } from 'src/content-generation/dto/generate-document.dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  NoteListDto,
  NoteDto,
  SummaryDto,
  DocumentListDto,
  NoteContentDto,
  NoteContentListDto,
} from './dto/note.dto';
import { DeleteContentDto } from './dto/delete-note-content.dto';

describe('NotesRepository', () => {
  let repository: NotesRepository;
  let dbServiceMock: Partial<DatabaseService>;
  let validationServiceMock: Partial<ValidationService>;

  beforeEach(async () => {
    dbServiceMock = {
      getDatabase: jest.fn(),
    };

    validationServiceMock = {
      transformAndValidate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesRepository,
        { provide: DatabaseService, useValue: dbServiceMock },
        { provide: ValidationService, useValue: validationServiceMock },
      ],
    }).compile();

    repository = module.get<NotesRepository>(NotesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllNotes', () => {
    it('should return all notes for a user', async () => {
      // Arrange
      const user: AuthenticatedUserDto = { userId: 'user123', iat: 0, exp: 0 };
      const notes = [
        { noteId: '1', title: 'Note 1' },
        { noteId: '2', title: 'Note 2' },
      ];

      const selectQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(notes),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue({ notes });

      // Act
      const result = await repository.findAllNotes(user);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('notes');
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'userId',
        '=',
        user.userId,
      );
      expect(selectQueryMock.execute).toHaveBeenCalled();

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        NoteListDto,
        {
          notes,
        },
      );

      expect(result).toEqual({ notes });
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      // Arrange
      const user: AuthenticatedUserDto = { userId: 'user123', iat: 0, exp: 0 };
      const createNoteDto: CreateNoteDto = {
        title: 'New Note',
        instruction: 'New instruction',
      };
      const createdNote = {
        noteId: '1',
        title: 'New Note',
        userId: user.userId,
      };

      const insertQueryMock = {
        values: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(createdNote),
      };

      const dbMock = {
        insertInto: jest.fn().mockReturnValue(insertQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue(createdNote);

      // Act
      const result = await repository.createNote(user, createNoteDto);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.insertInto).toHaveBeenCalledWith('notes');
      expect(insertQueryMock.values).toHaveBeenCalledWith({
        userId: user.userId,
        title: createNoteDto.title,
      });
      expect(insertQueryMock.returningAll).toHaveBeenCalled();
      expect(insertQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        NotFoundException,
      );

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        NoteDto,
        createdNote,
      );

      expect(result).toEqual(createdNote);
    });
  });

  describe('findOneNote', () => {
    it('should return a single note', async () => {
      // Arrange
      const findNoteDto: FindNoteDto = { noteId: '1' };
      const note = { noteId: '1', title: 'Note 1' };

      const selectQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(note),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue(note);

      // Act
      const result = await repository.findOneNote(findNoteDto);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('notes');
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'noteId',
        '=',
        findNoteDto.noteId,
      );
      expect(selectQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        NotFoundException,
      );

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        NoteDto,
        note,
      );

      expect(result).toEqual(note);
    });
  });

  describe('createSummary', () => {
    it('should create a summary for a note', async () => {
      // Arrange
      const createSummaryDto: CreateSummaryDto = { noteId: '1' };
      const generateSummaryDto: GenerateSummaryDto = {
        summary: 'Generated summary',
      };
      const createdSummary = {
        summaryId: '1',
        noteId: '1',
        content: 'Generated summary',
      };

      const insertQueryMock = {
        values: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(createdSummary),
      };

      const dbMock = {
        insertInto: jest.fn().mockReturnValue(insertQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue(createdSummary);

      // Act
      const result = await repository.createSummary(
        createSummaryDto,
        generateSummaryDto,
      );

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.insertInto).toHaveBeenCalledWith('summaries');
      expect(insertQueryMock.values).toHaveBeenCalledWith({
        noteId: createSummaryDto.noteId,
        content: generateSummaryDto.summary,
      });
      expect(insertQueryMock.returningAll).toHaveBeenCalled();
      expect(insertQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        UnprocessableEntityException,
      );

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        SummaryDto,
        createdSummary,
      );

      expect(result).toEqual(createdSummary);
    });
  });

  describe('findOneSummary', () => {
    it('should return a summary for a note', async () => {
      // Arrange
      const findSummaryDto: FindSummaryDto = { noteId: '1' };
      const summary = {
        summaryId: '1',
        noteId: '1',
        content: 'Summary content',
      };

      const selectQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(summary),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue(summary);

      // Act
      const result = await repository.findOneSummary(findSummaryDto);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('summaries');
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'noteId',
        '=',
        findSummaryDto.noteId,
      );
      expect(selectQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        expect.any(Function),
      );

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        SummaryDto,
        summary,
      );

      expect(result).toEqual(summary);
    });
  });

  describe('createDocument', () => {
    it('should handle missing result types gracefully', async () => {
      // Arrange
      const createDocumentDto: CreateDocumentDto = { noteId: '1' };
      const generateDocumentDto: GenerateDocumentDto = {
        contents: [
          { type: 'paragraph', content: 'Generated content' },
          { type: 'heading1', content: 'Unknown type content' },
        ],
      };

      const resultTypes = [{ resultTypeId: '1', typeName: 'paragraph' }];

      const selectQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(resultTypes),
      };

      const insertQueryMock = {
        values: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([
          {
            noteResultId: '1',
            noteId: '1',
            resultTypeId: '1',
            content: 'Generated content',
            orderIndex: 0,
          },
        ]),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
        insertInto: jest.fn().mockReturnValue(insertQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue({
        noteId: createDocumentDto.noteId,
        documents: [
          {
            noteResultId: '1',
            noteId: '1',
            resultTypeId: '1',
            content: 'Generated content',
            orderIndex: 0,
            typeName: 'paragraph',
          },
        ],
      });

      // Act
      const result = await repository.createDocument(
        createDocumentDto,
        generateDocumentDto,
      );

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalledTimes(2);
      expect(dbMock.selectFrom).toHaveBeenCalledWith('resultTypes');
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.execute).toHaveBeenCalled();

      expect(dbMock.insertInto).toHaveBeenCalledWith('noteResults');
      expect(insertQueryMock.values).toHaveBeenCalledWith([
        {
          noteId: '1',
          resultTypeId: '1',
          content: 'Generated content',
          orderIndex: 0,
        },
      ]);
      expect(insertQueryMock.returningAll).toHaveBeenCalled();
      expect(insertQueryMock.execute).toHaveBeenCalled();

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        DocumentListDto,
        {
          noteId: createDocumentDto.noteId,
          documents: [
            {
              noteResultId: '1',
              noteId: '1',
              resultTypeId: '1',
              content: 'Generated content',
              orderIndex: 0,
              typeName: 'paragraph',
            },
          ],
        },
      );

      expect(result).toEqual({
        noteId: createDocumentDto.noteId,
        documents: [
          {
            noteResultId: '1',
            noteId: '1',
            resultTypeId: '1',
            content: 'Generated content',
            orderIndex: 0,
            typeName: 'paragraph',
          },
        ],
      });
    });
    it('should create a document for a note', async () => {
      // Arrange
      const createDocumentDto: CreateDocumentDto = { noteId: '1' };
      const generateDocumentDto: GenerateDocumentDto = {
        contents: [
          { type: 'paragraph', content: 'Generated content 1' },
          { type: 'heading1', content: 'Generated content 2' },
        ],
      };

      const resultTypes = [
        { resultTypeId: '1', typeName: 'paragraph' },
        { resultTypeId: '2', typeName: 'heading1' },
      ];

      const insertedResults = [
        {
          noteResultId: '1',
          noteId: '1',
          resultTypeId: '1',
          content: 'Generated content 1',
          orderIndex: 0,
        },
        {
          noteResultId: '2',
          noteId: '1',
          resultTypeId: '2',
          content: 'Generated content 2',
          orderIndex: 1,
        },
      ];

      const finalResults = insertedResults.map((result) => ({
        ...result,
        typeName:
          resultTypes.find((rt) => rt.resultTypeId === result.resultTypeId)
            ?.typeName || '',
      }));

      // Mocking initializeResultTypeMap
      repository['resultTypeNameToTypeIdMap'] = new Map(
        resultTypes.map((rt) => [rt.typeName, rt.resultTypeId]),
      );
      repository['resultTypeIdToTypeNameMap'] = new Map(
        resultTypes.map((rt) => [rt.resultTypeId, rt.typeName]),
      );

      const insertQueryMock = {
        values: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(insertedResults),
      };

      const dbMock = {
        insertInto: jest.fn().mockReturnValue(insertQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue({
        noteId: createDocumentDto.noteId,
        documents: finalResults,
      });

      // Act
      const result = await repository.createDocument(
        createDocumentDto,
        generateDocumentDto,
      );

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.insertInto).toHaveBeenCalledWith('noteResults');
      expect(insertQueryMock.values).toHaveBeenCalledWith([
        {
          noteId: createDocumentDto.noteId,
          resultTypeId: '1',
          content: 'Generated content 1',
          orderIndex: 0,
        },
        {
          noteId: createDocumentDto.noteId,
          resultTypeId: '2',
          content: 'Generated content 2',
          orderIndex: 1,
        },
      ]);
      expect(insertQueryMock.returningAll).toHaveBeenCalled();
      expect(insertQueryMock.execute).toHaveBeenCalled();

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        DocumentListDto,
        {
          noteId: createDocumentDto.noteId,
          documents: finalResults,
        },
      );

      expect(result).toEqual({
        noteId: createDocumentDto.noteId,
        documents: finalResults,
      });
    });
  });

  describe('findOneDocument', () => {
    it('should return a document for a note', async () => {
      // Arrange
      const findDocumentDto: FindDocumentDto = { noteId: '1' };
      const documents = [
        {
          noteResultId: '1',
          noteId: '1',
          resultTypeId: '1',
          content: 'Document content',
          typeName: 'paragraph',
        },
      ];

      const selectQueryMock = {
        innerJoin: jest.fn().mockReturnThis(),
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(documents),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue({
        noteId: findDocumentDto.noteId,
        documents,
      });

      // Act
      const result = await repository.findOneDocument(findDocumentDto);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('noteResults');
      expect(selectQueryMock.innerJoin).toHaveBeenCalledWith(
        'resultTypes',
        'resultTypes.resultTypeId',
        'noteResults.resultTypeId',
      );
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'noteId',
        '=',
        findDocumentDto.noteId,
      );
      expect(selectQueryMock.execute).toHaveBeenCalled();

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        DocumentListDto,
        {
          noteId: findDocumentDto.noteId,
          documents,
        },
      );

      expect(result).toEqual({
        noteId: findDocumentDto.noteId,
        documents,
      });
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
      const contentTypeId = '1';
      const createdContent = {
        noteContentId: '1',
        noteId: '1',
        contentTypeId,
        contentText: 'New content',
        fileUrl: null,
        sourceUrl: null,
        typeName: 'text',
      };

      const selectQueryMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue({ contentTypeId }),
      };

      const insertQueryMock = {
        values: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue({
          noteContentId: '1',
          noteId: '1',
          contentTypeId,
          contentText: 'New content',
          fileUrl: null,
          sourceUrl: null,
        }),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
        insertInto: jest.fn().mockReturnValue(insertQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue(createdContent);

      // Act
      const result = await repository.createContent(
        baseNoteDto,
        createContentDto,
      );

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('contentTypes');
      expect(selectQueryMock.select).toHaveBeenCalledWith('contentTypeId');
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'typeName',
        '=',
        createContentDto.contentType,
      );
      expect(selectQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        NotFoundException,
      );

      expect(dbMock.insertInto).toHaveBeenCalledWith('noteContents');
      expect(insertQueryMock.values).toHaveBeenCalledWith({
        noteId: baseNoteDto.noteId,
        contentTypeId,
        contentText: createContentDto.contentText,
        fileUrl: null,
        sourceUrl: null,
      });
      expect(insertQueryMock.returningAll).toHaveBeenCalled();
      expect(insertQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        UnprocessableEntityException,
      );

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        NoteContentDto,
        {
          ...createdContent,
        },
      );

      expect(result).toEqual(createdContent);
    });
  });

  describe('findAllContents', () => {
    it('should return all contents for a note', async () => {
      // Arrange
      const baseNoteDto: BaseNoteDto = { noteId: '1' };
      const note = { noteId: '1', title: 'Note 1', instruction: 'Instruction' };
      const contents = [
        {
          noteContentId: '1',
          noteId: '1',
          contentTypeId: '1',
          contentText: 'Content 1',
          typeName: 'text',
        },
      ];

      const selectNoteQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(note),
      };

      const selectContentsQueryMock = {
        innerJoin: jest.fn().mockReturnThis(),
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(contents),
      };

      const dbMock = {
        selectFrom: jest.fn().mockImplementation((tableName) => {
          if (tableName === 'notes') {
            return selectNoteQueryMock;
          } else if (tableName === 'noteContents') {
            return selectContentsQueryMock;
          }
        }),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);
      (
        validationServiceMock.transformAndValidate as jest.Mock
      ).mockResolvedValue({
        noteId: note.noteId,
        title: note.title,
        instruction: note.instruction,
        contents,
      });

      // Act
      const result = await repository.findAllContents(baseNoteDto);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('notes');
      expect(selectNoteQueryMock.selectAll).toHaveBeenCalled();
      expect(selectNoteQueryMock.where).toHaveBeenCalledWith(
        'noteId',
        '=',
        baseNoteDto.noteId,
      );
      expect(selectNoteQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        NotFoundException,
      );

      expect(dbMock.selectFrom).toHaveBeenCalledWith('noteContents');
      expect(selectContentsQueryMock.innerJoin).toHaveBeenCalledWith(
        'contentTypes',
        'contentTypes.contentTypeId',
        'noteContents.contentTypeId',
      );
      expect(selectContentsQueryMock.selectAll).toHaveBeenCalled();
      expect(selectContentsQueryMock.where).toHaveBeenCalledWith(
        'noteContents.noteId',
        '=',
        baseNoteDto.noteId,
      );
      expect(selectContentsQueryMock.execute).toHaveBeenCalled();

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        NoteContentListDto,
        {
          noteId: note.noteId,
          title: note.title,
          instruction: note.instruction,
          contents,
        },
      );

      expect(result).toEqual({
        noteId: note.noteId,
        title: note.title,
        instruction: note.instruction,
        contents,
      });
    });
  });

  describe('deleteContent', () => {
    it('should delete content for a note', async () => {
      // Arrange
      const deleteContentDto: DeleteContentDto = { contentId: '1' };

      const deleteQueryMock = {
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };

      const dbMock = {
        deleteFrom: jest.fn().mockReturnValue(deleteQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);

      // Act
      await repository.deleteContent(deleteContentDto);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.deleteFrom).toHaveBeenCalledWith('noteContents');
      expect(deleteQueryMock.where).toHaveBeenCalledWith(
        'contentId',
        '=',
        deleteContentDto.contentId,
      );
      expect(deleteQueryMock.execute).toHaveBeenCalled();
    });

    it('should throw an error if deletion fails', async () => {
      // Arrange
      const deleteContentDto: DeleteContentDto = { contentId: '1' };

      const deleteQueryMock = {
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error('Deletion failed')),
      };

      const dbMock = {
        deleteFrom: jest.fn().mockReturnValue(deleteQueryMock),
      };

      (dbServiceMock.getDatabase as jest.Mock).mockReturnValue(dbMock);

      // Act & Assert
      await expect(repository.deleteContent(deleteContentDto)).rejects.toThrow(
        'Deletion failed',
      );

      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.deleteFrom).toHaveBeenCalledWith('noteContents');
      expect(deleteQueryMock.where).toHaveBeenCalledWith(
        'contentId',
        '=',
        deleteContentDto.contentId,
      );
      expect(deleteQueryMock.execute).toHaveBeenCalled();
    });
  });
});
