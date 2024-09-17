import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Auth0UserInfoDto, UserInfoDto } from './dto/user-info.dto';
import { ValidationService } from 'src/validation/validation.service';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly validationService: ValidationService,
  ) {}

  async createUser(userInfo: Auth0UserInfoDto) {
    const user = await this.db
      .getDatabase()
      .insertInto('users')
      .values({
        userId: userInfo.sub,
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        nickname: userInfo.nickname,
        name: userInfo.name,
        picture: userInfo.picture,
        updatedAt: userInfo.updated_at,
        email: userInfo.email,
        emailVerified: userInfo.email_verified,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.validationService.transformAndValidate(UserInfoDto, user);
  }

  async findUser(userInfo: Auth0UserInfoDto) {
    const user = await this.db
      .getDatabase()
      .selectFrom('users')
      .selectAll()
      .where('userId', '=', userInfo.sub)
      .executeTakeFirstOrThrow(() => {
        throw new NotFoundException('User not found');
      });

    return this.validationService.transformAndValidate(UserInfoDto, user);
  }
}
