import type { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  type interfaces,
} from "inversify-express-utils";

import type { Logger, LoggerFactory } from "@/common/logger";
import {
  noteContentPostRequestSchema,
  noteGetRequestSchema,
  notePostRequestSchema,
} from "@/common/types/schema/note.schema";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import type { NoteService } from "@/services/note/note.service";

@controller("/note")
export class NoteController implements interfaces.Controller {
  private readonly logger: Logger;
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.NoteService)
    private readonly noteService: NoteService,
    @inject(DEPENDENCY_IDENTIFIERS.LoggerFactory)
    private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory.createLogger("HTTP");
  }

  @httpPost("/metadata", validateRequest(notePostRequestSchema))
  async createNote(req: Request, res: Response) {
    const title = req.body.title as string;
    const content = req.body.content as string | null;
    const serviceResponse = await this.noteService.createNote(title, content);
    this.logger.info(
      { serviceResponse, url: req.url },
      "sending service response",
    );
    return handleServiceResponse(serviceResponse, res);
  }

  @httpGet("/metadata/:noteId", validateRequest(noteGetRequestSchema))
  async getNote(req: Request, res: Response) {
    const noteId = req.params.noteId as string;
    const serviceResponse = await this.noteService.getNote(noteId);
    this.logger.info(
      { serviceResponse, url: req.url },
      "sending service response",
    );
    return handleServiceResponse(serviceResponse, res);
  }

  @httpPost("/summary/:noteId", validateRequest(noteContentPostRequestSchema))
  async createNoteSummary(req: Request, res: Response) {
    const noteId = req.params.noteId as string;
    const serviceResponse = await this.noteService.createNoteSummary(noteId);
    return handleServiceResponse(serviceResponse, res);
  }

  @httpGet("/summary/:noteId", validateRequest(noteGetRequestSchema))
  async getNoteSummary(req: Request, res: Response) {
    const noteId = req.params.noteId as string;
    const serviceResponse = await this.noteService.getNoteSummary(noteId);
    return handleServiceResponse(serviceResponse, res);
  }

  @httpPost("/segment/:noteId", validateRequest(noteContentPostRequestSchema))
  async createNoteSegment(req: Request, res: Response) {
    const noteId = req.params.noteId as string;
    const content = req.body.content as string;
    const contentType = req.body.contentType as string;
    const serviceResponse = await this.noteService.addNoteContent(
      noteId,
      contentType,
      content,
    );
    this.logger.info(
      { serviceResponse, url: req.url },
      "sending service response",
    );
    return handleServiceResponse(serviceResponse, res);
  }

  @httpGet("/segments/:noteId", validateRequest(noteGetRequestSchema))
  async getNoteSegments(req: Request, res: Response) {
    const noteId = req.params.noteId as string;
    const serviceResponse = await this.noteService.getNoteSegments(noteId);
    return handleServiceResponse(serviceResponse, res);
  }

  @httpGet("/list/all")
  async getNotes(req: Request, res: Response) {
    const serviceResponse = await this.noteService.getNotes();
    return handleServiceResponse(serviceResponse, res);
  }

  @httpPost("/document/:noteId")
  async createNoteDocument(req: Request, res: Response) {
    const noteId = req.params.noteId as string;
    const serviceResponse = await this.noteService.createNoteDocument(noteId);
    return handleServiceResponse(serviceResponse, res);
  }

  @httpGet("/document/:noteId")
  async getNoteDocument(req: Request, res: Response) {
    const noteId = req.params.noteId as string;
    const serviceResponse = await this.noteService.getNoteDocument(noteId);

    return handleServiceResponse(serviceResponse, res);
  }
}
