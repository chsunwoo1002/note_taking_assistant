import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindNoteDto } from './dto/find-note.dto';
import { CreateSummaryDto } from 'src/notes/dto/create-summary.dto';
import { FindSummaryDto } from './dto/find-summary.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FindDocumentDto } from './dto/find-document.dto';
import { ValidationService } from 'src/validation/validation.service';
import {
  DocumentListDto,
  NoteContentDto,
  NoteContentListDto,
  NoteDto,
  NoteListDto,
  SummaryDto,
} from './dto/note.dto';
import { GenerateSummaryDto } from 'src/content-generation/dto/generate-summary.dto';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { BaseNoteDto } from './dto/base-note.dto';
import { GenerateDocumentDto } from 'src/content-generation/dto/generate-document.dto';
import { InsertNoteResult } from 'src/database/database.type';
import { DeleteContentDto } from './dto/delete-note-content.dto';

@Injectable()
export class NotesRepository {
  private resultTypeIdToTypeNameMap?: Map<string, string>;
  private resultTypeNameToTypeIdMap?: Map<string, string>;
  constructor(
    private readonly db: DatabaseService,
    private readonly validationService: ValidationService,
  ) {}

  async findAllNotes(user: AuthenticatedUserDto): Promise<NoteListDto> {
    const result = await this.db
      .getDatabase()
      .selectFrom('notes')
      .selectAll()
      .where('userId', '=', user.userId)
      .execute();

    return this.validationService.transformAndValidate(NoteListDto, {
      notes: result,
    });
  }

  async createNote(
    user: AuthenticatedUserDto,
    createNoteDto: CreateNoteDto,
  ): Promise<NoteDto> {
    const result = await this.db
      .getDatabase()
      .insertInto('notes')
      .values({
        userId: user.userId,
        title: createNoteDto.title,
      })
      .returningAll()
      .executeTakeFirstOrThrow(NotFoundException);

    return this.validationService.transformAndValidate(NoteDto, result);
  }

  async findOneNote(findNoteDto: FindNoteDto): Promise<NoteDto> {
    const result = await this.db
      .getDatabase()
      .selectFrom('notes')
      .selectAll()
      .where('noteId', '=', findNoteDto.noteId)
      .executeTakeFirstOrThrow(NotFoundException);

    return this.validationService.transformAndValidate(NoteDto, result);
  }

  async createSummary(
    createSummaryDto: CreateSummaryDto,
    generateSummaryDto: GenerateSummaryDto,
  ): Promise<SummaryDto> {
    const result = await this.db
      .getDatabase()
      .insertInto('summaries')
      .values({
        noteId: createSummaryDto.noteId,
        content: generateSummaryDto.summary,
      })
      .returningAll()
      .executeTakeFirstOrThrow(UnprocessableEntityException);

    return this.validationService.transformAndValidate(SummaryDto, result);
  }

  async findOneSummary(findSummaryDto: FindSummaryDto): Promise<SummaryDto> {
    const result = await this.db
      .getDatabase()
      .selectFrom('summaries')
      .selectAll()
      .where('noteId', '=', findSummaryDto.noteId)
      .executeTakeFirstOrThrow(() => new NotFoundException());

    return this.validationService.transformAndValidate(SummaryDto, result);
  }

  async createDocument(
    createDocumentDto: CreateDocumentDto,
    generateDocumentDto: GenerateDocumentDto,
  ) {
    await this.initializeResultTypeMap();

    const insertValues: InsertNoteResult[] = generateDocumentDto.contents
      .map((content, idx) => ({
        noteId: createDocumentDto.noteId,
        resultTypeId: this.resultTypeNameToTypeIdMap?.get(content.type) || '',
        content: content.content,
        orderIndex: idx,
      }))
      .filter((content) => content.resultTypeId);

    const result = await this.db
      .getDatabase()
      .insertInto('noteResults')
      .values(insertValues)
      .returningAll()
      .execute()
      .then((results) => {
        return results.map((result) => {
          return {
            ...result,
            typeName:
              this.resultTypeIdToTypeNameMap?.get(result.resultTypeId) || '',
          };
        });
      });

    return this.validationService.transformAndValidate(DocumentListDto, {
      noteId: createDocumentDto.noteId,
      documents: result,
    });
  }

  async findOneDocument(findDocumentDto: FindDocumentDto) {
    const result = await this.db
      .getDatabase()
      .selectFrom('noteResults')
      .innerJoin(
        'resultTypes',
        'resultTypes.resultTypeId',
        'noteResults.resultTypeId',
      )
      .selectAll()
      .where('noteId', '=', findDocumentDto.noteId)
      .execute();

    return this.validationService.transformAndValidate(DocumentListDto, {
      noteId: findDocumentDto.noteId,
      documents: result,
    });
  }

  async createContent(
    baseNoteDto: BaseNoteDto,
    createContentDto: CreateContentDto,
  ) {
    const { contentTypeId } = await this.db
      .getDatabase()
      .selectFrom('contentTypes')
      .select('contentTypeId')
      .where('typeName', '=', createContentDto.contentType)
      .executeTakeFirstOrThrow(NotFoundException);

    const result = await this.db
      .getDatabase()
      .insertInto('noteContents')
      .values({
        noteId: baseNoteDto.noteId,
        contentTypeId: contentTypeId,
        contentText: createContentDto.contentText || null,
        fileUrl: createContentDto.fileUrl || null,
        sourceUrl: createContentDto.sourceUrl || null,
      })
      .returningAll()
      .executeTakeFirstOrThrow(UnprocessableEntityException);

    return this.validationService.transformAndValidate(NoteContentDto, {
      ...result,
      typeName: createContentDto.contentType,
    });
  }

  async deleteContent(deleteContentDto: DeleteContentDto) {
    await this.db
      .getDatabase()
      .deleteFrom('noteContents')
      .where('contentId', '=', deleteContentDto.contentId)
      .execute();
  }

  async findAllContents(findContentsDto: BaseNoteDto) {
    const [note, contents] = await Promise.all([
      this.db
        .getDatabase()
        .selectFrom('notes')
        .selectAll()
        .where('noteId', '=', findContentsDto.noteId)
        .executeTakeFirstOrThrow(NotFoundException),

      this.db
        .getDatabase()
        .selectFrom('noteContents')
        .innerJoin(
          'contentTypes',
          'contentTypes.contentTypeId',
          'noteContents.contentTypeId',
        )
        .selectAll()
        .where('noteContents.noteId', '=', findContentsDto.noteId)
        .execute(),
    ]);

    return this.validationService.transformAndValidate(NoteContentListDto, {
      noteId: note.noteId,
      title: note.title,
      instruction: note.instruction,
      contents: contents,
    });
  }

  private async initializeResultTypeMap() {
    return new Promise((resolve, reject) => {
      if (this.resultTypeNameToTypeIdMap && this.resultTypeIdToTypeNameMap) {
        resolve(undefined);
      }

      this.db
        .getDatabase()
        .selectFrom('resultTypes')
        .selectAll()
        .execute()
        .then((resultTypes) => {
          const resultTypesMap = new Map<string, string>();
          resultTypes.forEach((resultType) => {
            resultTypesMap.set(resultType.typeName, resultType.resultTypeId);
          });
          this.resultTypeNameToTypeIdMap = resultTypesMap;

          const resultTypeIdToTypeNameMap = new Map<string, string>();
          resultTypes.forEach((resultType) => {
            resultTypeIdToTypeNameMap.set(
              resultType.resultTypeId,
              resultType.typeName,
            );
          });
          this.resultTypeIdToTypeNameMap = resultTypeIdToTypeNameMap;
          resolve(undefined);
        })
        .catch(reject);
    });
  }
}
