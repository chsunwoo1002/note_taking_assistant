import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

export const addErrorToRequestLog: ErrorRequestHandler = (
  err,
  _req,
  res,
  next,
) => {
  res.locals.err = err;
  next(err);
};
