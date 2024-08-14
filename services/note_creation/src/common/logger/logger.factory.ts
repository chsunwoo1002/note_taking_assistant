import { injectable } from "inversify";

import { Logger } from "@/common/logger";
import type { LoggerLabel } from "@/common/types/types/logger.types";

@injectable()
export class LoggerFactory {
  createLogger(label: LoggerLabel): Logger {
    return new Logger(label);
  }
}
