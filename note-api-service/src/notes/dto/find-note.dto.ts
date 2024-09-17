import { IsNotEmpty, IsString } from 'class-validator';
import { Note } from 'src/database/database.type';

export class FindNoteDto {
  @IsString()
  @IsNotEmpty()
  noteId: string;
}

export class FindNoteResponseDto implements Note {
  noteId: string;
  userId: string;
  title: string;
  instruction: string | null;
  createdAt: Date;
  updatedAt: Date;
}
