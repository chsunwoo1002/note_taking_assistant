import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class AuthEnvConfig {
  @IsString()
  AUTH0_DOMAIN: string;

  @IsString()
  JWT_SECRET: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(AuthEnvConfig, config, {
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

export default registerAs('auth', () => ({
  auth0Domain: process.env.AUTH0_DOMAIN,
  jwtSecret: process.env.JWT_SECRET,
}));
