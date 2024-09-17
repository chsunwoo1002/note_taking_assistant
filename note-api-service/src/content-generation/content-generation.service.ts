import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { NoteContentListDto } from 'src/notes/dto/note.dto';
import { ValidationService } from 'src/validation/validation.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';

@Injectable()
export class ContentGenerationService {
  private readonly openai: OpenAI;
  private readonly generatedSummarySchema = z.object({
    summary: z.string(),
  });
  private readonly generatedNoteSchema = z.object({
    contents: z.array(
      z.object({
        type: z.enum([
          'heading1',
          'heading2',
          'heading3',
          'heading4',
          'paragraph',
        ]),
        content: z.string(),
      }),
    ),
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
  ) {
    const config = this.configService.get('contentGeneration');
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
      organization: config.openaiOrganization,
    });
  }

  async generateSummary(
    noteContentListDto: NoteContentListDto,
  ): Promise<GenerateSummaryDto> {
    const prompt = `
    Title: ${noteContentListDto.title}
  
    Content:
    ${noteContentListDto.contents.map((content, idx) => `${idx + 1}. ${content.contentText}`).join('\n\n')}
  
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

    const response = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: zodResponseFormat(
        this.generatedSummarySchema,
        'summary',
      ),
    });

    const generatedContent = response.choices[0].message.parsed;

    if (!generatedContent) {
      throw new InternalServerErrorException();
    }

    return this.validationService.transformAndValidate(
      GenerateSummaryDto,
      generatedContent,
    );
  }

  async generateDocument(
    noteContentListDto: NoteContentListDto,
  ): Promise<GenerateDocumentDto> {
    const prompt = `
    Title: ${noteContentListDto.title}

    Content:
    ${noteContentListDto.contents.map((content, idx) => `${idx + 1}. ${content.contentText}`).join('\n\n')}

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

    const response = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: zodResponseFormat(this.generatedNoteSchema, 'document'),
    });
    const generatedContent = response.choices[0].message.parsed;

    if (!generatedContent) {
      throw new InternalServerErrorException();
    }

    return this.validationService.transformAndValidate(
      GenerateDocumentDto,
      generatedContent,
    );
  }
}
