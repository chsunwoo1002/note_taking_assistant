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

@controller("/notes")
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

  @httpPost("/", validateRequest(notePostRequestSchema))
  async createNote(req: Request, res: Response) {
    const title = req.body.title as string;
    const serviceResponse = await this.noteService.createNote(title);
    this.logger.info(
      { serviceResponse, url: req.url },
      "sending service response",
    );
    return handleServiceResponse(serviceResponse, res);
  }

  @httpGet("/:note_id", validateRequest(noteGetRequestSchema))
  async getNote(req: Request, res: Response) {
    const note_id = req.params.note_id as string;
    const serviceResponse = await this.noteService.getNote(note_id);
    this.logger.info(
      { serviceResponse, url: req.url },
      "sending service response",
    );
    return handleServiceResponse(serviceResponse, res);
  }

  @httpPost("/:note_id", validateRequest(noteContentPostRequestSchema))
  async createNoteContent(req: Request, res: Response) {
    const note_id = req.params.id as string;
    const content = req.body.content as string;
    const content_type = req.body.content_type as string;
    const serviceResponse = await this.noteService.addNoteContent(
      note_id,
      content_type,
      content,
    );
    this.logger.info(
      { serviceResponse, url: req.url },
      "sending service response",
    );
    return handleServiceResponse(serviceResponse, res);
  }
}
