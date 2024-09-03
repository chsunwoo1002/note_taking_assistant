import { injectable } from "inversify";

import { type ILogger, Logger } from "@/common/logger";
import type { LoggerLabel } from "@/common/types/types/logger.types";

export interface ILoggerFactory {
  createLogger(label: LoggerLabel): ILogger;
}
@injectable()
export class LoggerFactory implements ILoggerFactory {
  createLogger(label: LoggerLabel): ILogger {
    return new Logger(label);
  }
}
