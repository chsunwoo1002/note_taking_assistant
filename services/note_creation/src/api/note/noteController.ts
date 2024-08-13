import type { Request, RequestHandler, Response } from "express";

import { noteService } from "@/api/note/noteService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class NoteController {
  public createNote: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await noteService.createNote();
    return handleServiceResponse(serviceResponse, res);
  };

  public getNote: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const serviceResponse = await noteService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateNote: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const content = req.body.content as string;
    const serviceResponse = await noteService.addContent(id, content);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const noteController = new NoteController();
