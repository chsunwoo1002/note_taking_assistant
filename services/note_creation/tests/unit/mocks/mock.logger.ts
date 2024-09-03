import type { ILogger, ILoggerFactory } from "@/common/logger";

export class MockLoggerFactory implements ILoggerFactory {
  createLogger = jest.fn();
}

export class MockLogger implements ILogger {
  info = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
}
