import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthenticatedUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  iat: number; // issued at

  @IsNumber()
  exp: number; // expiration time
}
