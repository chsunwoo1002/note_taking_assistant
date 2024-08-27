import type {
  AddTextRequestParams,
  CreateNoteRequestParams,
  Note
} from "~types/note.types"
import { noteSchema } from "~types/note.types"
import { API_URL } from "~utils/envConfig"

class NoteApiService {
  private static async sendRequest<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: data ? JSON.stringify(data) : undefined
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseJson = await response.json()
      console.log("response json", responseJson)
      return responseJson.data
    } catch (error) {
      console.error(`Error in note API request to ${endpoint}:`, error)
      throw error
    }
  }

  static async addContent(data: AddTextRequestParams): Promise<void> {
    const { noteId, content, contentType } = data
    return this.sendRequest(`/note/${noteId}`, "POST", { content, contentType })
  }

  static async createNote(data: CreateNoteRequestParams): Promise<Note> {
    return this.sendRequest("/note", "POST", data).then((note) => {
      console.log("note before parse", note)
      return noteSchema.parse(note)
    })
  }

  static async getNotes(): Promise<Note[]> {
    return this.sendRequest<Note[]>("/note/list/all", "GET")
  }
}

export default NoteApiService
