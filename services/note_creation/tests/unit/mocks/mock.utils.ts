import type { ServiceResponse } from "@/common/models/serviceResponse";
import type { Response } from "express";

export const mockEnv = {
  NODE_ENV: "test",
  IS_PRODUCTION: false,
  HOST: "localhost",
  PORT: 3000,
  CORS_ORIGIN: "http://localhost:3000",
  COMMON_RATE_LIMIT_MAX_REQUESTS: 1000,
  COMMON_RATE_LIMIT_WINDOW_MS: 1000,
  OPENAI_API_KEY: "OPENAI_API_KEY",
  OPENAI_ORGANIZATION: "OPENAI_ORG",
  DB_HOST: "DB_HOST",
  DB_PORT: 3000,
  DB_USERNAME: "DB_USERNAME",
  DB_PASSWORD: "DB_PASSWORD",
  DB_NAME: "DB_NAME",
  DB_SSL_REJECT_UNAUTHORIZED: false,
  DB_SSL_CA: "DB_SSL_CA",
};

export const mockHandleServiceResponse = jest.fn(
  (serviceResponse: ServiceResponse<any>, response: Response) => {
    response.status(serviceResponse.statusCode).send(serviceResponse);
    return response;
  },
);
