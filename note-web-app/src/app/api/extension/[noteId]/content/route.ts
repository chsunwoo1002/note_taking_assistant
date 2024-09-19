import NoteCreationApi from "@/api/note.api";
import { validateSchema } from "@/schema/helper";
import {
  createNoteContentRequestSchema,
  CreateNoteIdParam,
  createNoteIdParamSchema,
} from "@/app/api/extension/extension-request.schema";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { getSessionByExtensionToken } from "../../extension-session";
import { ExtensionNoteApi } from "../../extension-note.api";

export async function POST(request: Request, params: CreateNoteIdParam) {
  try {
    const extensionToken = request.headers.get("x-extension-token");
    const session = await getSessionByExtensionToken(extensionToken);

    if (!session || !session.apiAccessToken) {
      return NextResponse.json({ status: StatusCodes.UNAUTHORIZED });
    }

    const body = await request.json();

    const validateParams = validateSchema(createNoteIdParamSchema, params);
    const createNoteContent = validateSchema(
      createNoteContentRequestSchema,
      body
    );

    if (!createNoteContent || !validateParams) {
      return NextResponse.json({ status: StatusCodes.BAD_REQUEST });
    }

    const noteId = validateParams.params.noteId;
    const noteContent = await ExtensionNoteApi.createNoteContent(
      noteId,
      createNoteContent,
      session.apiAccessToken
    );
    return NextResponse.json(noteContent);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
