import { format } from "date-fns";
import { injectable } from "inversify";
import pino from "pino";

import type { LoggerLabel } from "@/common/types/types/logger.types";
import { PATHS } from "@/common/utils/constants";

export interface ILogger {
  info(obj: any, msg?: string, ...args: any[]): void;
  error(obj: any, msg?: string, ...args: any[]): void;
  warn(obj: any, msg?: string, ...args: any[]): void;
  debug(obj: any, msg?: string, ...args: any[]): void;
}

@injectable()
export class Logger implements ILogger {
  private logger: pino.Logger;

  constructor(label: LoggerLabel, isProduction: boolean) {
    const transport = isProduction
      ? pino.transport({
          target: "pino/file",
          options: {
            destination: `${PATHS.LOGS}/${format(new Date(), "yyyy-MM-dd")}.log`,
            mkdir: true,
          },
        })
      : pino.transport({
          target: "pino-pretty",
          options: {
            levelFirst: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
            singleLine: false,
            colorize: true,
          },
        });

    this.logger = pino(
      {
        level: isProduction ? "info" : "debug",
        base: { label },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      transport,
    );
  }

  info(obj: any, msg?: string, ...args: any[]): void {
    this.logger.info(obj, msg, ...args);
  }

  error(obj: any, msg?: string, ...args: any[]): void {
    this.logger.error(obj, msg, ...args);
  }

  warn(obj: any, msg?: string, ...args: any[]): void {
    this.logger.warn(obj, msg, ...args);
  }

  debug(obj: any, msg?: string, ...args: any[]): void {
    this.logger.debug(obj, msg, ...args);
  }
}
