import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DatabaseConnection } from './database.type';
import { DatabaseSchema } from './database.interface';

@Injectable()
export class DatabaseService {
  private db: DatabaseConnection;

  constructor(private configService: ConfigService) {
    const dbConfig = this.configService.get('database');

    const pool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      ssl: dbConfig.ssl,
    });

    this.db = new Kysely<DatabaseSchema>({
      dialect: new PostgresDialect({ pool }),
      plugins: [new CamelCasePlugin()],
    });
  }

  getDatabase(): DatabaseConnection {
    return this.db;
  }
}
