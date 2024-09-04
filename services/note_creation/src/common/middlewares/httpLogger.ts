import type { NextFunction, Request, Response } from "express";
import { container } from "../cores/container";
import type { ILoggerFactory } from "../logger/logger.factory";
import { DEPENDENCY_IDENTIFIERS } from "../utils/constants";

export const httpLogger = () => {
  const loggerFactory = container.get<ILoggerFactory>(
    DEPENDENCY_IDENTIFIERS.LoggerFactory,
  );
  const logger = loggerFactory.createLogger("HTTP");
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
      },
      "Received HTTP Request",
    );

    next();
  };
};
