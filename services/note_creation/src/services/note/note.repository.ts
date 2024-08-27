import { inject, injectable } from "inversify";

import type {
  Note,
  NoteContent,
  NoteResult,
} from "@/common/types/types/db.types";
import type { DatabaseConnection } from "@/common/types/types/db.types";
import type { GeneratedNote } from "@/common/types/types/note.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";

@injectable()
export class NoteRepository {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.Kysely)
    private readonly dbService: DatabaseConnection,
  ) {}

  async createNote(title: string, instruction: string | null): Promise<Note> {
    try {
      const query = await this.dbService
        .insertInto("notes")
        .values({ title, instruction })
        .returningAll()
        .executeTakeFirstOrThrow();
      return query;
    } catch (error) {
      console.error(error);
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
      console.error(error);
      throw error;
    }
  }

  async updateNote(
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
      console.error(error);
      throw error;
    }
  }

  async getNoteContent(noteId: string): Promise<NoteContent[]> {
    try {
      const query = await this.dbService
        .selectFrom("noteContents")
        .selectAll()
        .where("noteId", "=", noteId)
        .execute();
      return query;
    } catch (error) {
      console.error(error);
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
      console.error(error);
      throw error;
    }
  }

  async createNoteResult(noteId: string, result: GeneratedNote) {
    try {
      const resultTypes = await this.dbService
        .selectFrom("resultTypes")
        .selectAll()
        .execute();
      console.log(resultTypes);
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
        .execute();
      await this.dbService
        .insertInto("summaries")
        .values({ noteId, content: result.summary })
        .execute();
    } catch (error) {
      console.error(error);
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
      console.error(error);
      throw error;
    }
  }

  async getNoteResult(noteId: string): Promise<NoteResult[]> {
    try {
      const resultTypes = await this.dbService
        .selectFrom("resultTypes")
        .selectAll()
        .execute();
      console.log(resultTypes);
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
        type: resultTypesMap.get(result.resultTypeId),
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
