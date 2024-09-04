import type { ILogger, ILoggerFactory } from "@/common/logger";

export class MockLoggerFactory implements ILoggerFactory {
  createLogger = jest.fn().mockReturnValue(new MockLogger());
}

export class MockLogger implements ILogger {
  info = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
}

export const mockPino = jest.fn(() => {
  return {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };
});
