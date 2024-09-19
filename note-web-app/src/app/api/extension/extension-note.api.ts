import { env } from "@/lib/env.config";
import { validateSchema } from "@/schema/helper";
import {
  DocumentList,
  DocumentListSchema,
  Note,
  NoteContent,
  NoteContentList,
  NoteContentListSchema,
  NoteContentSchema,
  NoteList,
  NoteListSchema,
  NoteSchema,
  Summary,
  SummarySchema,
} from "@/schema/note.schema";
import {
  CreateNoteContentRequest,
  CreateNoteRequest,
} from "@/app/api/extension/extension-request.schema";
import { getSession } from "@auth0/nextjs-auth0";

export class ExtensionNoteApi {
  private static async sendRequest<T>(
    endpoint: string,
    method: string,
    accessToken: string,
    data?: any
  ): Promise<T> {
    const url = `${env.NOTE_API_URL}/notes/${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

  static async createNote(
    note: CreateNoteRequest,
    accessToken: string
  ): Promise<Note> {
    const response = await this.sendRequest<Note>(
      "",
      "POST",
      accessToken,
      note
    );
    return validateSchema(NoteSchema, response);
  }

  static async createNoteContent(
    noteId: string,
    content: CreateNoteContentRequest,
    accessToken: string
  ): Promise<NoteContentList> {
    const response = await this.sendRequest<NoteContent>(
      `${noteId}/content`,
      "POST",
      accessToken,
      content
    );
    return validateSchema(NoteContentSchema, response);
  }

  static async getAllNotes(accessToken: string): Promise<NoteList> {
    const response = await this.sendRequest<NoteList>("", "GET", accessToken);
    return validateSchema(NoteListSchema, response);
  }
}
