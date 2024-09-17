// auth.service.spec.ts

import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { HttpService } from 'src/http/http.service';
import { ConfigService } from '@nestjs/config';
import { ValidationService } from 'src/validation/validation.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth0UserInfoDto, UserInfoDto } from './dto/user-info.dto';
import { JwtDto } from './dto/jwt.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepositoryMock: Partial<AuthRepository>;
  let httpServiceMock: Partial<HttpService>;
  let configServiceMock: Partial<ConfigService>;
  let validationServiceMock: Partial<ValidationService>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(() => {
    authRepositoryMock = {
      createUser: jest.fn(),
      findUser: jest.fn(),
    };

    httpServiceMock = {
      get: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn(),
    };

    validationServiceMock = {
      transformAndValidate: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
    };

    configServiceMock.get = jest.fn().mockReturnValue({
      auth0Domain: 'https://auth0-domain.com',
      jwtSecret: 'test-secret',
    });

    authService = new AuthService(
      authRepositoryMock as AuthRepository,
      httpServiceMock as HttpService,
      configServiceMock as ConfigService,
      validationServiceMock as ValidationService,
      jwtServiceMock as JwtService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a user and return JWT token', async () => {
      // Arrange
      const signUpDto: SignUpDto = {
        accessToken: 'auth0-access-token',
      };

      const auth0UserInfo: Auth0UserInfoDto = {
        sub: 'auth0|123456',
        given_name: 'John',
        family_name: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updated_at: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        email_verified: true,
      };

      const userInfo: UserInfoDto = new UserInfoDto();
      Object.assign(userInfo, {
        userId: 'auth0|123456',
        givenName: 'John',
        familyName: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updatedAt: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        emailVerified: true,
      });

      const jwtToken = 'jwt-token';
      const jwtDto = new JwtDto();
      jwtDto.accessToken = jwtToken;

      httpServiceMock.get = jest.fn().mockResolvedValue(auth0UserInfo);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValueOnce(auth0UserInfo) // For getUserInfo
        .mockResolvedValueOnce(jwtDto); // For createJwtToken
      authRepositoryMock.createUser = jest.fn().mockResolvedValue(userInfo);
      jwtServiceMock.sign = jest.fn().mockReturnValue(jwtToken);

      // Act
      const result = await authService.signUp(signUpDto);

      // Assert
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://auth0-domain.com/userinfo',
        {
          Authorization: `Bearer ${signUpDto.accessToken}`,
        },
      );
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        Auth0UserInfoDto,
        auth0UserInfo,
      );
      expect(authRepositoryMock.createUser).toHaveBeenCalledWith(auth0UserInfo);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        userId: userInfo.userId,
      });
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        JwtDto,
        { accessToken: jwtToken },
      );
      expect(result).toBe(jwtDto);
    });

    it('should throw an error if getUserInfo fails', async () => {
      // Arrange
      const signUpDto: SignUpDto = {
        accessToken: 'invalid-access-token',
      };

      httpServiceMock.get = jest
        .fn()
        .mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        'Invalid token',
      );

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://auth0-domain.com/userinfo',
        {
          Authorization: `Bearer ${signUpDto.accessToken}`,
        },
      );
      expect(validationServiceMock.transformAndValidate).not.toHaveBeenCalled();
      expect(authRepositoryMock.createUser).not.toHaveBeenCalled();
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if createUser fails', async () => {
      // Arrange
      const signUpDto: SignUpDto = {
        accessToken: 'auth0-access-token',
      };

      const auth0UserInfo: Auth0UserInfoDto = {
        sub: 'auth0|123456',
        given_name: 'John',
        family_name: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updated_at: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        email_verified: false,
      };

      httpServiceMock.get = jest.fn().mockResolvedValue(auth0UserInfo);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(auth0UserInfo);
      const createUserError = new Error('Database error');
      authRepositoryMock.createUser = jest
        .fn()
        .mockRejectedValue(createUserError);

      // Act & Assert
      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        createUserError,
      );

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://auth0-domain.com/userinfo',
        {
          Authorization: `Bearer ${signUpDto.accessToken}`,
        },
      );
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        Auth0UserInfoDto,
        auth0UserInfo,
      );
      expect(authRepositoryMock.createUser).toHaveBeenCalledWith(auth0UserInfo);
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return JWT token', async () => {
      // Arrange
      const signInDto: SignInDto = {
        accessToken: 'auth0-access-token',
      };

      const auth0UserInfo: Auth0UserInfoDto = {
        sub: 'auth0|123456',
        given_name: 'John',
        family_name: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updated_at: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        email_verified: false,
      };

      const userInfo: UserInfoDto = new UserInfoDto();
      userInfo.userId = 'auth0|123456';

      const jwtToken = 'jwt-token';
      const jwtDto = new JwtDto();
      jwtDto.accessToken = jwtToken;

      httpServiceMock.get = jest.fn().mockResolvedValue(auth0UserInfo);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValueOnce(auth0UserInfo) // For getUserInfo
        .mockResolvedValueOnce(jwtDto); // For createJwtToken
      authRepositoryMock.findUser = jest.fn().mockResolvedValue(userInfo);
      jwtServiceMock.sign = jest.fn().mockReturnValue(jwtToken);

      // Act
      const result = await authService.signIn(signInDto);

      // Assert
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://auth0-domain.com/userinfo',
        {
          Authorization: `Bearer ${signInDto.accessToken}`,
        },
      );
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        Auth0UserInfoDto,
        auth0UserInfo,
      );
      expect(authRepositoryMock.findUser).toHaveBeenCalledWith(auth0UserInfo);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        userId: userInfo.userId,
      });
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        JwtDto,
        { accessToken: jwtToken },
      );
      expect(result).toBe(jwtDto);
    });

    it('should throw an error if user not found', async () => {
      // Arrange
      const signInDto: SignInDto = {
        accessToken: 'auth0-access-token',
      };

      const auth0UserInfo: Auth0UserInfoDto = {
        sub: 'auth0|123456',
        given_name: 'John',
        family_name: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updated_at: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        email_verified: false,
      };

      httpServiceMock.get = jest.fn().mockResolvedValue(auth0UserInfo);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(auth0UserInfo);
      const findUserError = new Error('User not found');
      authRepositoryMock.findUser = jest.fn().mockRejectedValue(findUserError);

      // Act & Assert
      await expect(authService.signIn(signInDto)).rejects.toThrow(
        findUserError,
      );

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://auth0-domain.com/userinfo',
        {
          Authorization: `Bearer ${signInDto.accessToken}`,
        },
      );
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        Auth0UserInfoDto,
        auth0UserInfo,
      );
      expect(authRepositoryMock.findUser).toHaveBeenCalledWith(auth0UserInfo);
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });

  describe('getUserInfo', () => {
    it('should get user info from Auth0 and validate it', async () => {
      // Arrange
      const accessToken = 'auth0-access-token';

      const auth0UserInfo: Auth0UserInfoDto = {
        sub: 'auth0|123456',
        given_name: 'John',
        family_name: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updated_at: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        email_verified: false,
      };
      httpServiceMock.get = jest.fn().mockResolvedValue(auth0UserInfo);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(auth0UserInfo);

      // Act
      const result = await authService['getUserInfo'](accessToken);

      // Assert
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://auth0-domain.com/userinfo',
        {
          Authorization: `Bearer ${accessToken}`,
        },
      );
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        Auth0UserInfoDto,
        auth0UserInfo,
      );
      expect(result).toBe(auth0UserInfo);
    });

    it('should throw an error if Auth0 returns an error', async () => {
      // Arrange
      const accessToken = 'invalid-access-token';
      const auth0Error = new Error('Invalid token');

      httpServiceMock.get = jest.fn().mockRejectedValue(auth0Error);

      // Act & Assert
      await expect(authService['getUserInfo'](accessToken)).rejects.toThrow(
        auth0Error,
      );

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://auth0-domain.com/userinfo',
        {
          Authorization: `Bearer ${accessToken}`,
        },
      );
      expect(validationServiceMock.transformAndValidate).not.toHaveBeenCalled();
    });
  });

  describe('createJwtToken', () => {
    it('should create JWT token and validate it', async () => {
      // Arrange
      const userInfo: UserInfoDto = {
        userId: 'auth0|123456',
        givenName: 'John',
        familyName: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updatedAt: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        emailVerified: false,
        createdAt: new Date('2023-10-10T00:00:00.000Z'),
      };

      const jwtToken = 'jwt-token';
      const jwtDto = new JwtDto();
      jwtDto.accessToken = jwtToken;

      jwtServiceMock.sign = jest.fn().mockReturnValue(jwtToken);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(jwtDto);

      // Act
      const result = await authService['createJwtToken'](userInfo);

      // Assert
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        userId: userInfo.userId,
      });
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        JwtDto,
        { accessToken: jwtToken },
      );
      expect(result).toBe(jwtDto);
    });

    it('should throw an error if validation fails', async () => {
      // Arrange
      const userInfo: UserInfoDto = {
        userId: 'auth0|123456',
        givenName: 'John',
        familyName: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updatedAt: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        emailVerified: false,
        createdAt: new Date('2023-10-10T00:00:00.000Z'),
      };

      const jwtToken = 'jwt-token';
      const validationError = new Error('Validation failed');

      jwtServiceMock.sign = jest.fn().mockReturnValue(jwtToken);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockRejectedValue(validationError);

      // Act & Assert
      await expect(authService['createJwtToken'](userInfo)).rejects.toThrow(
        validationError,
      );

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        userId: userInfo.userId,
      });
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        JwtDto,
        { accessToken: jwtToken },
      );
    });
  });
});
