import { type ILogger, Logger } from "@/common/logger/logger";
import { PATHS } from "@/common/utils/constants";
import { format } from "date-fns";
import { type MockProxy, mock } from "jest-mock-extended";
import pino from "pino";

jest.mock("pino");

describe("Logger", () => {
  let mockedPino: MockProxy<typeof pino>;
  let mockedLogger: MockProxy<pino.Logger<string>>;
  let logger: ILogger;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPino = mock<typeof pino>();
    mockedLogger = mock<pino.Logger<string>>();
    (pino as jest.MockedFunction<typeof pino>).mockReturnValue(mockedLogger);
    (pino as any).transport = jest.fn().mockReturnValue({});
    (pino as any).stdTimeFunctions = { isoTime: "isoTime" };
  });

  describe("Constructor", () => {
    it("should create a production logger when IS_PRODUCTION is true", () => {
      const expectedDestination = `${PATHS.LOGS}/${format(new Date(), "yyyy-MM-dd")}.log`;

      new Logger("DB", true);

      expect(pino.transport).toHaveBeenCalledWith({
        target: "pino/file",
        options: {
          destination: expectedDestination,
          mkdir: true,
        },
      });

      expect(pino).toHaveBeenCalledWith(
        {
          level: "info",
          base: { label: "DB" },
          timestamp: "isoTime",
        },
        expect.anything(),
      );
    });

    it("should create a development logger when IS_PRODUCTION is false", () => {
      new Logger("DB", false);

      expect(pino.transport).toHaveBeenCalledWith({
        target: "pino-pretty",
        options: {
          levelFirst: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
          singleLine: false,
          colorize: true,
        },
      });

      expect(pino).toHaveBeenCalledWith(
        {
          level: "debug",
          base: { label: "DB" },
          timestamp: "isoTime",
        },
        expect.anything(),
      );
    });
  });

  describe("Logging methods", () => {
    beforeEach(() => {
      logger = new Logger("DB", false);
    });

    it("should call info method correctly", () => {
      logger.info({ key: "value" }, "Test message", "extra");
      expect(mockedLogger.info).toHaveBeenCalledWith(
        { key: "value" },
        "Test message",
        "extra",
      );
    });

    it("should call error method correctly", () => {
      logger.error({ key: "value" }, "Test message", "extra");
      expect(mockedLogger.error).toHaveBeenCalledWith(
        { key: "value" },
        "Test message",
        "extra",
      );
    });

    it("should call warn method correctly", () => {
      logger.warn({ key: "value" }, "Test message", "extra");
      expect(mockedLogger.warn).toHaveBeenCalledWith(
        { key: "value" },
        "Test message",
        "extra",
      );
    });

    it("should call debug method correctly", () => {
      logger.debug({ key: "value" }, "Test message", "extra");
      expect(mockedLogger.debug).toHaveBeenCalledWith(
        { key: "value" },
        "Test message",
        "extra",
      );
    });
  });
});
