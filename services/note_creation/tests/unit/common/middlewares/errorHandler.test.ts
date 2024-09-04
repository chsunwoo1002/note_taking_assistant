import {
  addErrorToRequestLog,
  unexpectedRequest,
} from "@/common/middlewares/errorHandler";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

describe("errorHandler middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      sendStatus: jest.fn(),
      locals: {},
    };
    nextFunction = jest.fn();
  });

  test("unexpectedRequest should send 404 status", () => {
    unexpectedRequest(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  test("addErrorToRequestLog should add error to res.locals and call next", () => {
    const testError = new Error("Test error");
    addErrorToRequestLog(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.locals?.err).toBe(testError);
    expect(nextFunction).toHaveBeenCalledWith(testError);
  });
});
