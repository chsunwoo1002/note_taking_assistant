import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Note, NoteResultSummary } from 'src/database/database.type';
import { IsNullable } from 'src/validation/decorator/is-nullable.decorator';

export class NoteDto implements Note {
  @IsString()
  @IsOptional()
  @Exclude()
  userId: string;

  @IsString()
  @IsNotEmpty()
  noteId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  instruction: string | null;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

export class NoteListDto {
  @IsArray()
  @ValidateNested()
  @Type(() => NoteDto)
  notes: NoteDto[];
}

export class SummaryDto implements NoteResultSummary {
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsString()
  content: string;

  @IsString()
  summaryId: string;

  @IsString()
  noteId: string;
}

export class NoteContentDto {
  @IsString()
  @IsOptional()
  @Exclude()
  contentTypeId: string;

  @IsUUID()
  contentId: string;

  @IsUUID()
  @IsOptional()
  @Exclude()
  noteId: string;

  @IsString()
  contentText: string;

  @IsNullable()
  @IsString()
  fileUrl: string | null;

  @IsNullable()
  @IsString()
  sourceUrl: string | null;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsString()
  @IsEnum(['text', 'image', 'video'])
  typeName: 'text' | 'image' | 'video';
}

export class NoteContentListDto {
  @IsString()
  noteId: string;

  @IsString()
  title: string;

  @IsString()
  @IsNullable()
  instruction: string | null;

  @IsArray()
  @ValidateNested()
  @Type(() => NoteContentDto)
  contents: NoteContentDto[];
}

export class DocumentDto {
  @IsString()
  @IsOptional()
  @Exclude()
  noteId?: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsNullable()
  @IsString()
  content: string | null;

  @IsNullable()
  @IsString()
  fileUrl: string | null;

  @IsString()
  resultId: string;

  @IsEnum(['heading1', 'heading2', 'heading3', 'heading4', 'paragraph'])
  typeName: 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'paragraph';

  @IsString()
  @IsOptional()
  @Exclude()
  resultTypeId?: string;

  @IsNumber()
  orderIndex: number;
}
export class DocumentListDto {
  @IsString()
  noteId: string;

  @IsArray()
  @ValidateNested()
  @Type(() => DocumentDto)
  documents: DocumentDto[];
}
