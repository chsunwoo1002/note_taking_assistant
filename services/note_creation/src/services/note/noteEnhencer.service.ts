import type { Logger, LoggerFactory } from "@/common/logger";
import type {
  Note,
  NoteContent,
  OpenAIClient,
} from "@/common/types/types/db.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { inject, injectable } from "inversify";

@injectable()
export class NoteEnhancerService {
  private readonly logger: Logger;
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.LoggerFactory)
    private readonly loggerFactory: LoggerFactory,
    @inject(DEPENDENCY_IDENTIFIERS.OpenAIClient)
    private readonly openAIClient: OpenAIClient,
  ) {
    this.logger = this.loggerFactory.createLogger("SERVICE_NOTE");
  }

  async getEnhancedNote(note: Note, contents: NoteContent[]) {
    const prompt = `
    Title: ${note.title}

    Content:
    ${contents.map((content) => content.content_text).join("\n\n")}

    Based on the above title and content, please create a well-structured document. The document should:
    1. Start with an introduction that explains the main topic.
    2. Organize the content into logical sections with appropriate headings.
    3. Include a brief conclusion or summary at the end.
    4. Maintain a coherent flow throughout the document.
    5. Correct any grammatical errors or improve the language where necessary.
    `;
    const response = await this.openAIClient.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content.",
        },
        { role: "user", content: prompt },
      ],
    });
    const generatedContent = response.choices[0].message.content;
    this.logger.info(
      {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      "final content generated",
    );
    return generatedContent || "Note is empty";
  }
}
