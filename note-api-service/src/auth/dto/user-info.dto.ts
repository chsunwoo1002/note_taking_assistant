import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/database/database.type';

export class UserInfoDto implements User {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  givenName: string | null;

  @IsString()
  @IsOptional()
  familyName: string | null;

  @IsString()
  @IsOptional()
  nickname: string | null;

  @IsString()
  @IsOptional()
  name: string | null;

  @IsString()
  @IsOptional()
  picture: string | null;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  emailVerified: boolean;
}
export class Auth0UserInfoDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsString()
  given_name: string;

  @IsString()
  family_name: string;

  @IsString()
  nickname: string;

  @IsString()
  name: string;

  @IsString()
  picture: string;

  @IsDate()
  @Type(() => Date)
  updated_at: Date;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  email_verified: boolean;
}
