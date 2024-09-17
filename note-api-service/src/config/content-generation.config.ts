import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class ContentGenerationEnvConfig {
  @IsString()
  OPENAI_API_KEY: string;

  @IsString()
  OPENAI_ORGANIZATION: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(ContentGenerationEnvConfig, config, {
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

export default registerAs('contentGeneration', () => ({
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiOrganization: process.env.OPENAI_ORGANIZATION,
}));
