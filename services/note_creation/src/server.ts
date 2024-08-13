import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { noteRouter } from "@/api/note/noteRouter";
import errorHandler from "@/common/middlewares/errorHandler";
import requestLogger from "@/common/middlewares/requestLogger";
import { env } from "@/common/utils/envConfig";

const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  name: "INIT",
});
const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Request logging
app.use(requestLogger);

// Routes
app.use("/note", noteRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
