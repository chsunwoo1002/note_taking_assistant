import type { Note } from "@/api/note/noteModel";

export const notes: Note[] = [
  {
    id: "1",
    title: "Alice",
    content: ["alice@example.com"],
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: "2",
    title: "Robert",
    content: ["Robert@example.com"],
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
];

export class NoteRepository {
  async findAllAsync(): Promise<Note[]> {
    return notes;
  }

  async findByIdAsync(id: string): Promise<Note | null> {
    return notes.find((note) => note.id === id) || null;
  }
}
