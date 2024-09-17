import { IsString, IsNumber, IsBoolean, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { registerAs } from '@nestjs/config';

export class DatabaseEnvConfig {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsBoolean()
  DB_SSL_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  DB_SSL_CA: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(DatabaseEnvConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized:
      process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? false : true,
    ca: process.env.DB_SSL_CA === 'empty' ? undefined : process.env.DB_SSL_CA,
  },
}));
