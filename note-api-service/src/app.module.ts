import { Module } from '@nestjs/common';

import { NotesModule } from './notes/notes.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import appConfig, { validate as validateAppConfig } from './config/app.config';
import databaseConfig, {
  validate as validateDatabaseConfig,
} from './config/database.config';
import { ContentGenerationModule } from './content-generation/content-generation.module';
import { ValidationModule } from './validation/validation.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import authConfig, {
  validate as validateAuthConfig,
} from './config/auth.config';
import contentGenerationConfig, {
  validate as validateContentGenerationConfig,
} from './config/content-generation.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, contentGenerationConfig],
      validate: (config) => {
        validateAppConfig(config);
        validateDatabaseConfig(config);
        validateAuthConfig(config);
        validateContentGenerationConfig(config);
        return config;
      },
    }),
    NotesModule,
    DatabaseModule,
    ContentGenerationModule,
    ValidationModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
