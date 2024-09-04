import { inject, injectable } from "inversify";

import { type ILogger, Logger } from "@/common/logger";
import type { LoggerLabel } from "@/common/types/types/logger.types";
import { DEPENDENCY_IDENTIFIERS } from "../utils/constants";
import type { EnvConfig } from "../utils/env.config";

export interface ILoggerFactory {
  createLogger(label: LoggerLabel): ILogger;
}
@injectable()
export class LoggerFactory implements ILoggerFactory {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.EnvConfig) private env: EnvConfig,
  ) {}
  createLogger(label: LoggerLabel): ILogger {
    return new Logger(label, this.env.IS_PRODUCTION);
  }
}
