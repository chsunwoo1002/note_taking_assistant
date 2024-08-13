import express, { type Router } from "express";

import { noteController } from "@/api/note/noteController";
import { CreateNoteSchema, GetNoteSchema, UpdateNoteSchema } from "@/api/note/noteModel";
import { validateRequest } from "@/common/utils/httpHandlers";

export const noteRouter: Router = express.Router();

noteRouter.post("/", validateRequest(CreateNoteSchema), noteController.createNote);
noteRouter.get("/:id", validateRequest(GetNoteSchema), noteController.getNote);
noteRouter.put("/:id", validateRequest(UpdateNoteSchema), noteController.updateNote);
