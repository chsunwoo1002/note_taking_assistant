import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { HttpService } from 'src/http/http.service';
import { ConfigService } from '@nestjs/config';
import { ValidationService } from 'src/validation/validation.service';
import { Auth0UserInfoDto, UserInfoDto } from './dto/user-info.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  private readonly authConfig;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
    private readonly jwtService: JwtService,
  ) {
    this.authConfig = this.configService.get('auth');
  }

  async signUp(signUpDto: SignUpDto) {
    const userInfo = await this.getUserInfo(signUpDto.accessToken);
    const user = await this.authRepository.createUser(userInfo);
    return this.createJwtToken(user);
  }

  async signIn(signInDto: SignInDto) {
    const userInfo = await this.getUserInfo(signInDto.accessToken);
    const user = await this.authRepository.findUser(userInfo);
    return this.createJwtToken(user);
  }

  private async getUserInfo(accessToken: string): Promise<Auth0UserInfoDto> {
    const response = await this.httpService.get<Auth0UserInfoDto>(
      `${this.authConfig.auth0Domain}/userinfo`,
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
    const userInfo = await this.validationService.transformAndValidate(
      Auth0UserInfoDto,
      response,
    );
    return userInfo;
  }

  private async createJwtToken(user: UserInfoDto) {
    const accessToken = await this.jwtService.sign({ userId: user.userId });

    const tokenDto = await this.validationService.transformAndValidate(JwtDto, {
      accessToken,
    });
    return tokenDto;
  }
}
