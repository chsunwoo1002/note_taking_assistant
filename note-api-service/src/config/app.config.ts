import { IsString, IsNumber, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class AppConfig {
  @IsString()
  NODE_ENV: string;

  @IsNumber()
  PORT: number;

  @IsString()
  HOST: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(AppConfig, config, {
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

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
});
