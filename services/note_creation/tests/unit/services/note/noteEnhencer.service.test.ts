import type { ILogger, ILoggerFactory } from "@/common/logger";
import {
  generatedNoteSchema,
  generatedSummarySchema,
} from "@/common/types/schema/note.schema";
import type { OpenAIClient } from "@/common/types/types/db.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { NoteEnhancerService } from "@/services/note/noteEnhencer.service";
import { TestBed } from "@automock/jest";
import { zodResponseFormat } from "openai/helpers/zod";
import { MockLogger } from "tests/unit/mocks/mock.logger";
import { NOTE_MOCKS } from "tests/unit/mocks/mock.note";

describe("NoteEnhancerService", () => {
  let noteEnhancerService: NoteEnhancerService;
  let openAIClient: jest.Mocked<OpenAIClient>;
  let logger: jest.Mocked<ILogger>;

  beforeAll(() => {
    logger = new MockLogger();

    const { unit, unitRef } = TestBed.create<NoteEnhancerService>(
      NoteEnhancerService,
    )
      .mock<ILoggerFactory>(DEPENDENCY_IDENTIFIERS.LoggerFactory)
      .using({
        createLogger: jest.fn().mockReturnValue(logger),
      })
      .mock<OpenAIClient>(DEPENDENCY_IDENTIFIERS.OpenAIClient)
      .using({
        beta: {
          chat: {
            completions: {
              parse: jest.fn(),
            },
          },
        },
      })
      .compile();

    noteEnhancerService = unit;
    openAIClient = unitRef.get<OpenAIClient>(
      DEPENDENCY_IDENTIFIERS.OpenAIClient,
    ) as jest.Mocked<OpenAIClient>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate an enhanced note from the given note and contents", async () => {
    (openAIClient.beta.chat.completions.parse as jest.Mock).mockResolvedValue(
      NOTE_MOCKS.mockLLMResponse,
    );

    const result = await noteEnhancerService.getEnhancedNote(
      NOTE_MOCKS.mockNote,
      NOTE_MOCKS.mockNoteSegments,
    );

    expect(openAIClient.beta.chat.completions.parse).toHaveBeenCalledWith({
      model: "gpt-4o-mini",
      messages: expect.arrayContaining([
        expect.objectContaining({ role: "system" }),
        expect.objectContaining({ role: "user" }),
      ]),
      response_format: zodResponseFormat(generatedNoteSchema, "document"),
    });

    expect(result).toEqual(NOTE_MOCKS.mockLLMGeneratedNote);
  });

  it("should generate a note summary from the given note and contents", async () => {
    (
      openAIClient.beta.chat.completions.parse as jest.Mock
    ).mockResolvedValueOnce(NOTE_MOCKS.mockLLMResponseSummary);

    const result = await noteEnhancerService.getNoteSummary(
      NOTE_MOCKS.mockNote,
      NOTE_MOCKS.mockNoteSegments,
    );

    expect(openAIClient.beta.chat.completions.parse).toHaveBeenCalledWith({
      model: "gpt-4o-mini",
      messages: expect.arrayContaining([
        expect.objectContaining({ role: "system" }),
        expect.objectContaining({ role: "user" }),
      ]),
      response_format: zodResponseFormat(generatedSummarySchema, "document"),
    });

    expect(result).toEqual(NOTE_MOCKS.mockLLMGeneratedSummary.summary);
  });

  it("should throw an error if generated content is null for getEnhancedNote", async () => {
    (
      openAIClient.beta.chat.completions.parse as jest.Mock
    ).mockResolvedValueOnce({
      choices: [{ message: { parsed: null } }],
    });

    await expect(
      noteEnhancerService.getEnhancedNote(
        NOTE_MOCKS.mockNote,
        NOTE_MOCKS.mockNoteSegments,
      ),
    ).rejects.toThrow("generated content is null");
  });

  it("should throw an error if generated content is null for getNoteSummary", async () => {
    (
      openAIClient.beta.chat.completions.parse as jest.Mock
    ).mockResolvedValueOnce({
      choices: [{ message: { parsed: null } }],
    });

    await expect(
      noteEnhancerService.getNoteSummary(
        NOTE_MOCKS.mockNote,
        NOTE_MOCKS.mockNoteSegments,
      ),
    ).rejects.toThrow("generated content is null");
  });
});
