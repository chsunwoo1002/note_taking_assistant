import NoteCreationApi from "@/api/note.api";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { CreateNoteRequestSchema } from "@/app/api/extension/extension-request.schema";
import { validateSchema } from "@/schema/helper";
import { getSessionByExtensionToken } from "./extension-session";
import { ExtensionNoteApi } from "./extension-note.api";

export async function GET(request: Request) {
  try {
    const extensionToken = request.headers.get("x-extension-token");
    const session = await getSessionByExtensionToken(extensionToken);
    if (!session || !session.apiAccessToken) {
      return NextResponse.json({ status: StatusCodes.UNAUTHORIZED });
    }

    const notes = await ExtensionNoteApi.getAllNotes(session.apiAccessToken);

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}

export async function POST(request: Request) {
  try {
    const extensionToken = request.headers.get("x-extension-token");
    const session = await getSessionByExtensionToken(extensionToken);

    if (!session || !session.apiAccessToken) {
      return NextResponse.json({ status: StatusCodes.UNAUTHORIZED });
    }

    const body = await request.json();
    const createNote = validateSchema(CreateNoteRequestSchema, body);

    if (!createNote) {
      return NextResponse.json({ status: StatusCodes.BAD_REQUEST });
    }

    const note = await ExtensionNoteApi.createNote(
      createNote,
      session.apiAccessToken
    );
    return NextResponse.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
