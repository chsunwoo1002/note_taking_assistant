import "reflect-metadata";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { container } from "@/common/cores/container";
import { server } from "@/common/cores/server";
import type { LoggerFactory } from "@/common/logger";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { env } from "@/common/utils/env.config";
import errorHandler from "./common/middlewares/errorHandler";
import { httpLogger } from "./common/middlewares/httpLogger";

const loggerFactory = container.get<LoggerFactory>(
  DEPENDENCY_IDENTIFIERS.LoggerFactory,
);
const logger = loggerFactory.createLogger("SYSTEM");

server
  .setConfig((app) => {
    app.set("trust proxy", true);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(helmet());
    app.use(httpLogger());
  })
  .setErrorConfig((app) => {
    app.use(errorHandler());
  })
  .build()
  .listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "server is running");
  });
