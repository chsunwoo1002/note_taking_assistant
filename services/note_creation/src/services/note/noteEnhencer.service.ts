import { inject, injectable } from "inversify";
import { zodResponseFormat } from "openai/helpers/zod";

import type { Logger, LoggerFactory } from "@/common/logger";
import type { INoteEnhancerService } from "@/common/types/interfaces/note.interface";
import {
  generatedNoteSchema,
  generatedSummarySchema,
} from "@/common/types/schema/note.schema";
import type {
  Note,
  NoteContent,
  OpenAIClient,
} from "@/common/types/types/db.types";
import type { GeneratedNote } from "@/common/types/types/note.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";

@injectable()
export class NoteEnhancerService implements INoteEnhancerService {
  private readonly logger: Logger;
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.LoggerFactory)
    private readonly loggerFactory: LoggerFactory,
    @inject(DEPENDENCY_IDENTIFIERS.OpenAIClient)
    private readonly openAIClient: OpenAIClient,
  ) {
    this.logger = this.loggerFactory.createLogger("SERVICE_NOTE");
  }

  async getEnhancedNote(
    note: Note,
    contents: NoteContent[],
  ): Promise<GeneratedNote> {
    const prompt = `
    Title: ${note.title}

    Content:
    ${contents.map((content, idx) => `${idx + 1}. ${content.contentText}`).join("\n\n")}

    Based on the above title and content, please create a well-structured document. The document should:
    1. Start with an introduction that explains the main topic.
    2. Organize the content into logical sections with appropriate headings.
      a. Maximum depth of section is 5
      b. Divde the section based on context
      c. the maximum size of words for each section is 200 words
    3. Include a brief conclusion or summary at the end.
    4. Maintain a coherent flow throughout the document.
    5. Correct any grammatical errors or improve the language where necessary.
    6. The contents are the text segments that user crawled from other websites.
    7. Create the entire document from the text segmenets by organizing them.
    `;
    const response = await this.openAIClient.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content.",
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(generatedNoteSchema, "document"),
    });
    const generatedContent = response.choices[0].message.parsed;
    this.logger.info(
      {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      "final content generated",
    );
    if (!generatedContent) {
      throw new Error("generated content is null");
    }
    return generatedContent;
  }

  async getNoteSummary(note: Note, contents: NoteContent[]): Promise<string> {
    const prompt = `
    Title: ${note.title}
  
    Content:
    ${contents.map((content, idx) => `${idx + 1}. ${content.contentText}`).join("\n\n")}
  
    Based on the above title and content, please create a concise summary. The summary should:
    1. Be approximately 150-200 words long.
    2. Capture the main ideas and key points from the content.
    3. Maintain a coherent flow and be easy to understand.
    4. Highlight any important concepts, findings, or conclusions.
    5. Be written in a neutral, informative tone.
    6. Not introduce any new information not present in the original content.
    7. Begin with a brief introduction of the topic based on the title.
    8. End with a concluding sentence that encapsulates the overall message.
  
    Please provide the summary in a clear, well-structured paragraph format.
    `;

    const response = await this.openAIClient.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content.",
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(generatedSummarySchema, "document"),
    });
    const generatedContent = response.choices[0].message.parsed;
    this.logger.info(
      {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      "final content generated",
    );
    if (!generatedContent || !generatedContent.summary) {
      throw new Error("generated content is null");
    }
    return generatedContent.summary;
  }
}
