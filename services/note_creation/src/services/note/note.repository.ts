import { inject, injectable } from "inversify";

import type { Note, NoteContent } from "@/common/types/types/db.types";
import type { DatabaseConnection } from "@/common/types/types/db.types";
import type { GeneratedNote } from "@/common/types/types/note.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";

@injectable()
export class NoteRepository {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.Kysely)
    private readonly dbService: DatabaseConnection,
  ) {}

  async createNote(title: string): Promise<Note> {
    try {
      const query = await this.dbService
        .insertInto("notes")
        .values({ title })
        .returningAll()
        .executeTakeFirstOrThrow();
      return query;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getNote(note_id: string): Promise<Note> {
    try {
      const query = await this.dbService
        .selectFrom("notes")
        .selectAll()
        .where("note_id", "=", note_id)
        .executeTakeFirstOrThrow();
      return query;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateNote(
    note_id: string,
    content_type_id: string,
    content: string,
  ): Promise<void> {
    try {
      await this.dbService
        .insertInto("note_contents")
        .values({ note_id, content_type_id, content_text: content })
        .execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getNoteContent(note_id: string): Promise<NoteContent[]> {
    try {
      const query = await this.dbService
        .selectFrom("note_contents")
        .selectAll()
        .where("note_id", "=", note_id)
        .execute();
      return query;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getContentTypesIds(type_name: string): Promise<string> {
    try {
      const query = await this.dbService
        .selectFrom("content_types")
        .select("content_type_id")
        .where("type_name", "=", type_name)
        .executeTakeFirstOrThrow();
      return query.content_type_id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createNoteResult(note_id: string, result: GeneratedNote) {
    try {
      const resultTypes = await this.dbService
        .selectFrom("result_types")
        .selectAll()
        .execute();
      console.log(resultTypes);
      const resultTypesMap = new Map<string, string>();
      resultTypes.forEach((resultType) => {
        resultTypesMap.set(resultType.type_name, resultType.result_type_id);
      });
      const noteResultValues = result.contents.map((content, index) => ({
        note_id,
        result_type_id: resultTypesMap.get(content.type) || "paragraph",
        content: content.content,
        order_index: index,
      }));
      await this.dbService
        .insertInto("note_results")
        .values(noteResultValues)
        .execute();
      await this.dbService
        .insertInto("summaries")
        .values({ note_id, content: result.summary })
        .execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
