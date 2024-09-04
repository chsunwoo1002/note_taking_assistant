import { Logger } from "@/common/logger";
import { LoggerFactory } from "@/common/logger/logger.factory";
import type { LoggerLabel } from "@/common/types/types/logger.types";
import { env } from "@/common/utils/env.config";

describe("LoggerFactory", () => {
  let loggerFactory: LoggerFactory;

  beforeEach(() => {
    loggerFactory = new LoggerFactory(env);
  });

  it("should create a Logger instance with the given label", () => {
    const label: LoggerLabel = "DB";
    const logger = loggerFactory.createLogger(label);

    expect(logger).toBeInstanceOf(Logger);
  });
});
