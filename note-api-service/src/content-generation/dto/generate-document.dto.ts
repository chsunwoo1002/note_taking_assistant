import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';

export class DocumentContentDto {
  @IsEnum(['heading1', 'heading2', 'heading3', 'heading4', 'paragraph'])
  type: 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'paragraph';

  @IsString()
  content: string;
}

export class GenerateDocumentDto {
  @IsArray()
  @ValidateNested()
  @Type(() => DocumentContentDto)
  contents: DocumentContentDto[];
}
