import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseErrorFilter } from './database/filters/database-error.filter';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const authGuard = app.get(AuthGuard);
  app.useGlobalGuards(authGuard);

  app.useGlobalFilters(new DatabaseErrorFilter());

  await app.listen(8080);
}
bootstrap();
