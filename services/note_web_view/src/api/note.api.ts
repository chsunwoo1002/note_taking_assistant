import { env } from "@/lib/env.config";

interface NoteBaseInfo {
  id: string;
  title: string;
  instruction: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteSummary {
  noteId: string;
  createdAt: Date;
  updatedAt: Date;
  summaryId: string;
  content: string;
}

interface NoteSegment {
  contentId: string;
  noteId: string;
  contentTypeId: string;
  contentText: string;
  fileUrl: string | null;
  timestamp: string | null;
  sourceUrl: string | null;
  createdAt: string;
}

interface NoteDocument {
  resultId: string;
  noteId: string;
  resultTypeId: string;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  orderIndex: 7;
  content: string;
  type: string;
}

export default class NoteCreationApi {
  private static async sendRequest<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    const url = `${env.NOTE_CREATION_SERVER_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error(`Error in note API request to ${endpoint}:`, error);
      throw error;
    }
  }

  static async getNoteBaseInfo(noteId: string): Promise<NoteBaseInfo> {
    return this.sendRequest<NoteBaseInfo>(`/note/metadata/${noteId}`, "GET");
  }

  static async getNoteSummary(noteId: string): Promise<NoteSummary> {
    return this.sendRequest<NoteSummary>(`/note/summary/${noteId}`, "GET");
  }

  static async createNoteSummary(noteId: string): Promise<NoteSummary> {
    return this.sendRequest<NoteSummary>(`/note/summary/${noteId}`, "POST");
  }

  static async getDocument(noteId: string): Promise<NoteDocument[]> {
    return this.sendRequest<NoteDocument[]>(`/note/document/${noteId}`, "GET");
  }

  static async createDocument(noteId: string): Promise<NoteDocument[]> {
    return this.sendRequest<NoteDocument[]>(`/note/document/${noteId}`, "POST");
  }

  static async getNoteSegments(noteId: string): Promise<NoteSegment[]> {
    return this.sendRequest<NoteSegment[]>(`/note/segments/${noteId}`, "GET");
  }

  static async getAllNotes(): Promise<NoteBaseInfo[]> {
    return this.sendRequest<NoteBaseInfo[]>(`/note/list/all`, "GET");
  }
}
