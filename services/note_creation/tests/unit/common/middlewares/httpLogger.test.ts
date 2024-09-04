import { container } from "@/common/cores/container";
import type { ILoggerFactory } from "@/common/logger";
import { httpLogger } from "@/common/middlewares/httpLogger";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";

describe("httpLogger middleware", () => {
  const mockLoggerFactory = {
    createLogger: jest.fn().mockReturnValue({
      info: jest.fn().mockReturnValue({
        info: jest.fn(),
      }),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    container.snapshot();
    container.unbind(DEPENDENCY_IDENTIFIERS.LoggerFactory);
    container
      .bind<ILoggerFactory>(DEPENDENCY_IDENTIFIERS.LoggerFactory)
      .toConstantValue(mockLoggerFactory);
  });

  afterEach(() => {
    container.restore();
  });

  it("should log HTTP request information", () => {
    const middleware = httpLogger();
    const req = { method: "GET", originalUrl: "/test" } as any;
    const res = {} as any;
    const next = jest.fn();

    middleware(req, res, next);

    expect(mockLoggerFactory.createLogger).toHaveBeenCalledWith("HTTP");
    expect(mockLoggerFactory.createLogger().info).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "/test",
      },
      "Received HTTP Request",
    );
    expect(next).toHaveBeenCalled();
  });
});
