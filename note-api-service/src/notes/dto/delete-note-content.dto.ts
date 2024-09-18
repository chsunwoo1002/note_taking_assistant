import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteContentDto {
  @IsUUID()
  @IsNotEmpty()
  contentId: string;
}
