// content-generation.service.spec.ts

import { ContentGenerationService } from './content-generation.service';
import { ConfigService } from '@nestjs/config';
import { ValidationService } from 'src/validation/validation.service';
import { NoteContentListDto } from 'src/notes/dto/note.dto';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { GenerateDocumentDto } from './dto/generate-document.dto';
import { InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

jest.mock('openai');

describe('ContentGenerationService', () => {
  let service: ContentGenerationService;
  let configServiceMock: Partial<ConfigService>;
  let validationServiceMock: Partial<ValidationService>;
  let openAIMock: jest.Mocked<OpenAI>;

  beforeEach(() => {
    configServiceMock = {
      get: jest.fn().mockReturnValue({
        openaiApiKey: 'test-api-key',
        openaiOrganization: 'test-org',
      }),
    };

    validationServiceMock = {
      transformAndValidate: jest.fn(),
    };

    openAIMock = {
      beta: {
        chat: {
          completions: {
            parse: jest.fn(),
          },
        },
      },
    } as unknown as jest.Mocked<OpenAI>;

    service = new ContentGenerationService(
      configServiceMock as ConfigService,
      validationServiceMock as ValidationService,
    );

    (service as any).openai = openAIMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSummary', () => {
    it('should generate a summary and return validated data', async () => {
      // Arrange
      const noteContentListDto: NoteContentListDto = {
        title: 'Test Title',
        instruction: 'Generate a summary of the following note.',
        noteId: '1',
        contents: [
          {
            contentId: '1',
            contentText: 'First content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
          {
            contentId: '2',
            contentText: 'Second content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
        ],
      };

      const generatedSummary = {
        summary: 'This is a generated summary.',
      };

      const openAIResponse = {
        choices: [
          {
            message: {
              parsed: generatedSummary,
            },
          },
        ],
      };

      openAIMock.beta.chat.completions.parse = jest
        .fn()
        .mockResolvedValue(openAIResponse);

      const validatedSummaryDto = new GenerateSummaryDto();
      validatedSummaryDto.summary = generatedSummary.summary;

      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(validatedSummaryDto);

      // Act
      const result = await service.generateSummary(noteContentListDto);

      // Assert
      expect(openAIMock.beta.chat.completions.parse).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        messages: expect.any(Array),
        response_format: expect.any(Object),
      });

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        GenerateSummaryDto,
        generatedSummary,
      );

      expect(result).toBe(validatedSummaryDto);
    });

    it('should throw InternalServerErrorException if generatedContent is null', async () => {
      // Arrange
      const noteContentListDto: NoteContentListDto = {
        title: 'Test Title',
        instruction: 'Generate a summary of the following note.',
        noteId: '1',
        contents: [
          {
            contentId: '1',
            contentText: 'First content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
          {
            contentId: '2',
            contentText: 'Second content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
        ],
      };

      const openAIResponse = {
        choices: [
          {
            message: {
              parsed: null,
            },
          },
        ],
      };

      openAIMock.beta.chat.completions.parse = jest
        .fn()
        .mockResolvedValue(openAIResponse);

      // Act & Assert
      await expect(service.generateSummary(noteContentListDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(openAIMock.beta.chat.completions.parse).toHaveBeenCalled();
      expect(validationServiceMock.transformAndValidate).not.toHaveBeenCalled();
    });

    it('should handle OpenAI API errors', async () => {
      // Arrange
      const noteContentListDto: NoteContentListDto = {
        title: 'Test Title',
        instruction: 'Generate a summary of the following note.',
        noteId: '1',
        contents: [
          {
            contentId: '1',
            contentText: 'First content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
          {
            contentId: '2',
            contentText: 'Second content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
        ],
      };

      const openAIError = new Error('OpenAI API error');

      openAIMock.beta.chat.completions.parse = jest
        .fn()
        .mockRejectedValue(openAIError);

      // Act & Assert
      await expect(service.generateSummary(noteContentListDto)).rejects.toThrow(
        openAIError,
      );

      expect(openAIMock.beta.chat.completions.parse).toHaveBeenCalled();
      expect(validationServiceMock.transformAndValidate).not.toHaveBeenCalled();
    });
  });

  describe('generateDocument', () => {
    it('should generate a document and return validated data', async () => {
      // Arrange
      const noteContentListDto: NoteContentListDto = {
        title: 'Test Title',
        instruction: 'Generate a summary of the following note.',
        noteId: '1',
        contents: [
          {
            contentId: '1',
            contentText: 'First content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
          {
            contentId: '2',
            contentText: 'Second content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
        ],
      };

      const generatedDocument: GenerateDocumentDto = {
        contents: [
          {
            type: 'heading1',
            content: 'Introduction',
          },
          {
            type: 'paragraph',
            content: 'This is the first paragraph.',
          },
        ],
      };

      const openAIResponse = {
        choices: [
          {
            message: {
              parsed: generatedDocument,
            },
          },
        ],
      };

      openAIMock.beta.chat.completions.parse = jest
        .fn()
        .mockResolvedValue(openAIResponse);

      const validatedDocumentDto = new GenerateDocumentDto();
      validatedDocumentDto.contents = generatedDocument.contents;

      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(validatedDocumentDto);

      // Act
      const result = await service.generateDocument(noteContentListDto);

      // Assert
      expect(openAIMock.beta.chat.completions.parse).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        messages: expect.any(Array),
        response_format: expect.any(Object),
      });

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        GenerateDocumentDto,
        generatedDocument,
      );

      expect(result).toBe(validatedDocumentDto);
    });

    it('should throw InternalServerErrorException if generatedContent is null', async () => {
      // Arrange
      const noteContentListDto: NoteContentListDto = {
        title: 'Test Title',
        instruction: 'Generate a summary of the following note.',
        noteId: '1',
        contents: [
          {
            contentId: '1',
            contentText: 'First content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
          {
            contentId: '2',
            contentText: 'Second content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
        ],
      };

      const openAIResponse = {
        choices: [
          {
            message: {
              parsed: null,
            },
          },
        ],
      };

      openAIMock.beta.chat.completions.parse = jest
        .fn()
        .mockResolvedValue(openAIResponse);

      // Act & Assert
      await expect(
        service.generateDocument(noteContentListDto),
      ).rejects.toThrow(InternalServerErrorException);

      expect(openAIMock.beta.chat.completions.parse).toHaveBeenCalled();
      expect(validationServiceMock.transformAndValidate).not.toHaveBeenCalled();
    });

    it('should handle OpenAI API errors', async () => {
      // Arrange
      const noteContentListDto: NoteContentListDto = {
        title: 'Test Title',
        instruction: 'Generate a summary of the following note.',
        noteId: '1',
        contents: [
          {
            contentId: '1',
            contentText: 'First content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
          {
            contentId: '2',
            contentText: 'Second content segment.',
            createdAt: new Date('2024-01-01'),
            contentTypeId: 'text',
            noteId: '1',
            fileUrl: null,
            sourceUrl: null,
            typeName: 'text',
          },
        ],
      };

      const openAIError = new Error('OpenAI API error');

      openAIMock.beta.chat.completions.parse = jest
        .fn()
        .mockRejectedValue(openAIError);

      // Act & Assert
      await expect(
        service.generateDocument(noteContentListDto),
      ).rejects.toThrow(openAIError);

      expect(openAIMock.beta.chat.completions.parse).toHaveBeenCalled();
      expect(validationServiceMock.transformAndValidate).not.toHaveBeenCalled();
    });
  });
});
