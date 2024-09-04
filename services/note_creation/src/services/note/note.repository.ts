import { inject, injectable } from "inversify";

import type { ILogger, ILoggerFactory } from "@/common/logger";
import type { INoteRepository } from "@/common/types/interfaces/note.interface";
import type {
  Note,
  NoteContent,
  NoteResultSummary,
  NoteResultWithTypeName,
} from "@/common/types/types/db.types";
import type { DatabaseConnection } from "@/common/types/types/db.types";
import type { GeneratedNote } from "@/common/types/types/note.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";

@injectable()
export class NoteRepository implements INoteRepository {
  private readonly logger: ILogger;
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.Kysely)
    private readonly dbService: DatabaseConnection,
    @inject(DEPENDENCY_IDENTIFIERS.LoggerFactory)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = this.loggerFactory.createLogger("DB");
  }

  async createNote(title: string, instruction: string | null): Promise<Note> {
    try {
      const query = await this.dbService
        .insertInto("notes")
        .values({ title, instruction })
        .returningAll()
        .executeTakeFirstOrThrow();
      return query;
    } catch (error) {
      this.logger.error(error, "Error creating note");
      throw error;
    }
  }

  async getNote(noteId: string): Promise<Note> {
    try {
      const query = await this.dbService
        .selectFrom("notes")
        .selectAll()
        .where("noteId", "=", noteId)
        .executeTakeFirstOrThrow();
      return query;
    } catch (error) {
      this.logger.error(error, "Error getting note");
      throw error;
    }
  }

  async createNoteSummary(
    noteId: string,
    content: string,
  ): Promise<NoteResultSummary> {
    try {
      const query = await this.dbService
        .insertInto("summaries")
        .values({ noteId, content })
        .returningAll()
        .executeTakeFirstOrThrow();
      return query;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getNoteSummary(noteId: string): Promise<NoteResultSummary | null> {
    try {
      const query = await this.dbService
        .selectFrom("summaries")
        .selectAll()
        .where("noteId", "=", noteId)
        .executeTakeFirst();
      return query || null;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteNoteSummary(noteId: string): Promise<void> {
    try {
      await this.dbService
        .deleteFrom("summaries")
        .where("noteId", "=", noteId)
        .execute();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addNoteSegment(
    noteId: string,
    contentTypeId: string,
    content: string,
  ): Promise<void> {
    try {
      await this.dbService
        .insertInto("noteContents")
        .values({ noteId, contentTypeId, contentText: content })
        .execute();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getNoteSegments(noteId: string): Promise<NoteContent[]> {
    try {
      const query = await this.dbService
        .selectFrom("noteContents")
        .selectAll()
        .where("noteId", "=", noteId)
        .execute();
      this.logger.info(query, "Note segments");
      return query;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteNoteSegment(contentId: string): Promise<void> {
    try {
      await this.dbService
        .deleteFrom("noteContents")
        .where("contentId", "=", contentId)
        .execute();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getContentTypesIds(typeName: string): Promise<string> {
    try {
      const query = await this.dbService
        .selectFrom("contentTypes")
        .select("contentTypeId")
        .where("typeName", "=", typeName)
        .executeTakeFirstOrThrow();
      return query.contentTypeId;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createNoteDocument(noteId: string, result: GeneratedNote) {
    try {
      const resultTypes = await this.dbService
        .selectFrom("resultTypes")
        .selectAll()
        .execute();
      const resultTypesMap = new Map<string, string>();
      resultTypes.forEach((resultType) => {
        resultTypesMap.set(resultType.typeName, resultType.resultTypeId);
      });
      const noteResultValues = result.contents.map((content, index) => ({
        noteId,
        resultTypeId: resultTypesMap.get(content.type) || "paragraph",
        content: content.content,
        orderIndex: index,
      }));
      await this.dbService
        .insertInto("noteResults")
        .values(noteResultValues)
        .returningAll()
        .execute();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteNoteDocument(noteId: string): Promise<void> {
    try {
      await this.dbService
        .deleteFrom("noteResults")
        .where("noteId", "=", noteId)
        .execute();
      this.logger.info("deleted note document");
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getNotes(): Promise<Note[]> {
    try {
      const query = await this.dbService
        .selectFrom("notes")
        .selectAll()
        .execute();
      return query;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getNoteDocument(noteId: string): Promise<NoteResultWithTypeName[]> {
    try {
      const resultTypes = await this.dbService
        .selectFrom("resultTypes")
        .selectAll()
        .execute();
      this.logger.info(resultTypes, "Result types");
      const resultTypesMap = new Map<string, string>();
      resultTypes.forEach((resultType) => {
        resultTypesMap.set(resultType.resultTypeId, resultType.typeName);
      });
      const query = await this.dbService
        .selectFrom("noteResults")
        .selectAll()
        .where("noteId", "=", noteId)
        .execute();
      return query.map((result) => ({
        ...result,
        type: resultTypesMap.get(result.resultTypeId) || "paragraph",
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
