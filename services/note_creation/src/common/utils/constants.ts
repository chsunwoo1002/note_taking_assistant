import { path } from "app-root-path";
import { env } from "./env.config";

export const DEPENDENCY_IDENTIFIERS = {
  DatabaseConfig: Symbol.for("DatabaseConfig"),
  Database: Symbol.for("Database"),
  DatabaseService: Symbol.for("DatabaseService"),
  Kysely: Symbol.for("Kysely"),
  Logger: Symbol.for("Logger"),
  LoggerFactory: Symbol.for("LoggerFactory"),
  NoteService: Symbol.for("NoteService"),
  NoteRepository: Symbol.for("NoteRepository"),
  NoteEnhancerService: Symbol.for("NoteEnhancerService"),
  OpenAIConfig: Symbol.for("OpenAIConfig"),
  OpenAIClient: Symbol.for("OpenAIClient"),
};

export const DATABASE_CONFIG = {
  database: env.DB_NAME,
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  port: env.DB_PORT,
  max: 10,
  password: env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED,
    ca: env.DB_SSL_CA,
  },
};

export const PATHS = {
  ROOT: path,
  LOGS: `${path}/logs`,
};

export const OPENAI_CONFIG = {
  apiKey: env.OPENAI_API_KEY,
  organization: env.OPENAI_ORGANIZATION,
};
