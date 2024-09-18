import { env } from "@/lib/env.config";
import { validateSchema } from "@/schema/helper";
import {
  DocumentList,
  DocumentListSchema,
  Note,
  NoteContentList,
  NoteContentListSchema,
  NoteList,
  NoteListSchema,
  NoteSchema,
  Summary,
  SummarySchema,
} from "@/schema/note.schema";
import { getSession } from "@auth0/nextjs-auth0";

export default class NoteCreationApi {
  private static async sendRequest<T>(
    endpoint: string,
    method: string,
    headers: Record<string, string> = {},
    data?: any
  ): Promise<T> {
    const url = `${env.NOTE_API_URL}/notes/${endpoint}`;
    const session = await getSession();

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.apiAccessToken}`,
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (method === "DELETE" || response.status === 204) {
        return undefined as T;
      }

      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      throw error;
    }
  }

  static async getNote(noteId: string): Promise<Note> {
    const response = await this.sendRequest<Note>(`${noteId}`, "GET");
    return validateSchema(NoteSchema, response);
  }

  static async getSummary(noteId: string): Promise<Summary> {
    const response = await this.sendRequest<Summary>(
      `${noteId}/summary`,
      "GET"
    );
    return validateSchema(SummarySchema, response);
  }

  static async createSummary(noteId: string): Promise<Summary> {
    const response = await this.sendRequest<Summary>(
      `${noteId}/summary`,
      "POST"
    );
    return validateSchema(SummarySchema, response);
  }

  static async getDocument(noteId: string): Promise<DocumentList> {
    const response = await this.sendRequest<DocumentList>(
      `${noteId}/document`,
      "GET"
    );
    return validateSchema(DocumentListSchema, response);
  }

  static async createDocument(noteId: string): Promise<DocumentList> {
    const response = await this.sendRequest<DocumentList>(
      `${noteId}/document`,
      "POST"
    );
    return validateSchema(DocumentListSchema, response);
  }

  static async deleteContent(contentId: string): Promise<void> {
    await this.sendRequest<void>(`content/${contentId}`, "DELETE");
  }

  static async getNoteContents(noteId: string): Promise<NoteContentList> {
    const response = await this.sendRequest<NoteContentList>(
      `${noteId}/content`,
      "GET"
    );
    return validateSchema(NoteContentListSchema, response);
  }

  static async getAllNotes(): Promise<NoteList> {
    const response = await this.sendRequest<NoteList>("", "GET");
    return validateSchema(NoteListSchema, response);
  }
}
