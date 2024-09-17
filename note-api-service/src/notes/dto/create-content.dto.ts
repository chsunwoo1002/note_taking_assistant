import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsOptional()
  contentText: string;

  @IsUrl()
  @IsOptional()
  fileUrl?: string;

  @IsUrl()
  @IsOptional()
  sourceUrl?: string;

  @IsEnum(['text', 'image', 'video'])
  contentType: 'text' | 'image' | 'video';
}
