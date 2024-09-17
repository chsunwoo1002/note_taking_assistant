import { IsUUID } from 'class-validator';

export class BaseNoteDto {
  @IsUUID()
  noteId: string;
}
