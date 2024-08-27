import { Container, type interfaces } from "inversify";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import OpenAI from "openai";
import { Pool } from "pg";

import { Logger, LoggerFactory } from "@/common/logger";
import type {
  IDatabaseConfig,
  OpenAIConfig,
} from "@/common/types/interfaces/db.interface";
import type { DatabaseSchema } from "@/common/types/interfaces/db.interface";
import type {
  DatabaseConnection,
  OpenAIClient,
} from "@/common/types/types/db.types";
import {
  DEPENDENCY_IDENTIFIERS,
  OPENAI_CONFIG,
} from "@/common/utils/constants";
import { DATABASE_CONFIG } from "@/common/utils/constants";
import { NoteRepository } from "@/services/note/note.repository";
import { NoteService } from "@/services/note/note.service";
import { NoteEnhancerService } from "@/services/note/noteEnhencer.service";

import "@/services/note/note.controller";

const container = new Container();

container.bind<NoteService>(DEPENDENCY_IDENTIFIERS.NoteService).to(NoteService);
container
  .bind<NoteRepository>(DEPENDENCY_IDENTIFIERS.NoteRepository)
  .to(NoteRepository);

container
  .bind<IDatabaseConfig>(DEPENDENCY_IDENTIFIERS.DatabaseConfig)
  .toConstantValue(DATABASE_CONFIG);
container
  .bind<DatabaseConnection>(DEPENDENCY_IDENTIFIERS.Kysely)
  .toDynamicValue((context: interfaces.Context) => {
    const config = context.container.get<IDatabaseConfig>(
      DEPENDENCY_IDENTIFIERS.DatabaseConfig
    );
    const pool = new Pool(config);
    const dialect = new PostgresDialect({ pool });
    const db: DatabaseConnection = new Kysely<DatabaseSchema>({
      dialect,
      plugins: [new CamelCasePlugin()],
    });
    return db;
  });
container
  .bind<OpenAIConfig>(DEPENDENCY_IDENTIFIERS.OpenAIConfig)
  .toConstantValue(OPENAI_CONFIG);
container
  .bind<OpenAIClient>(DEPENDENCY_IDENTIFIERS.OpenAIClient)
  .toDynamicValue((context: interfaces.Context) => {
    const config = context.container.get<OpenAIConfig>(
      DEPENDENCY_IDENTIFIERS.OpenAIConfig
    );
    return new OpenAI(config);
  });
container
  .bind<NoteEnhancerService>(DEPENDENCY_IDENTIFIERS.NoteEnhancerService)
  .to(NoteEnhancerService);
container
  .bind<LoggerFactory>(DEPENDENCY_IDENTIFIERS.LoggerFactory)
  .to(LoggerFactory);
container.bind<Logger>(DEPENDENCY_IDENTIFIERS.Logger).to(Logger);

export { container };
