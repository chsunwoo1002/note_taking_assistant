// auth.repository.spec.ts

import { AuthRepository } from './auth.repository';
import { DatabaseService } from 'src/database/database.service';
import { ValidationService } from 'src/validation/validation.service';
import { Auth0UserInfoDto, UserInfoDto } from './dto/user-info.dto';
import { NotFoundException } from '@nestjs/common';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let dbServiceMock: Partial<DatabaseService>;
  let validationServiceMock: Partial<ValidationService>;

  beforeEach(() => {
    dbServiceMock = {
      getDatabase: jest.fn(),
    };

    validationServiceMock = {
      transformAndValidate: jest.fn(),
    };

    authRepository = new AuthRepository(
      dbServiceMock as DatabaseService,
      validationServiceMock as ValidationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return validated user data', async () => {
      // Arrange
      const userInfo: Auth0UserInfoDto = {
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

      const insertedUser = {
        userId: 'auth0|123456',
        givenName: 'John',
        familyName: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updatedAt: '2023-10-10T00:00:00.000Z',
        email: 'john.doe@example.com',
        emailVerified: true,
      };

      const validatedUser = new UserInfoDto();
      Object.assign(validatedUser, insertedUser);

      const insertQueryMock = {
        values: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(insertedUser),
      };

      const dbMock = {
        insertInto: jest.fn().mockReturnValue(insertQueryMock),
      };

      dbServiceMock.getDatabase = jest.fn().mockReturnValue(dbMock);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(validatedUser);

      // Act
      const result = await authRepository.createUser(userInfo);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.insertInto).toHaveBeenCalledWith('users');
      expect(insertQueryMock.values).toHaveBeenCalledWith({
        userId: userInfo.sub,
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        nickname: userInfo.nickname,
        name: userInfo.name,
        picture: userInfo.picture,
        updatedAt: userInfo.updated_at,
        email: userInfo.email,
        emailVerified: userInfo.email_verified,
      });
      expect(insertQueryMock.returningAll).toHaveBeenCalled();
      expect(insertQueryMock.executeTakeFirstOrThrow).toHaveBeenCalled();

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        UserInfoDto,
        insertedUser,
      );
      expect(result).toBe(validatedUser);
    });

    it('should throw an error if validation fails', async () => {
      // Arrange
      const userInfo: Auth0UserInfoDto = {
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

      const insertedUser = {
        userId: 'auth0|123456',
        givenName: 'John',
        familyName: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updatedAt: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        emailVerified: true,
      };

      const insertQueryMock = {
        values: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(insertedUser),
      };

      const dbMock = {
        insertInto: jest.fn().mockReturnValue(insertQueryMock),
      };

      dbServiceMock.getDatabase = jest.fn().mockReturnValue(dbMock);
      const validationError = new Error('Validation failed');
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockRejectedValue(validationError);

      // Act & Assert
      await expect(authRepository.createUser(userInfo)).rejects.toThrow(
        validationError,
      );

      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.insertInto).toHaveBeenCalledWith('users');
      expect(insertQueryMock.values).toHaveBeenCalledWith({
        userId: userInfo.sub,
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        nickname: userInfo.nickname,
        name: userInfo.name,
        picture: userInfo.picture,
        updatedAt: userInfo.updated_at,
        email: userInfo.email,
        emailVerified: userInfo.email_verified,
      });
      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        UserInfoDto,
        insertedUser,
      );
    });
  });

  describe('findUser', () => {
    it('should find and return validated user data', async () => {
      // Arrange
      const userInfo: Auth0UserInfoDto = {
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

      const foundUser = {
        userId: 'auth0|123456',
        givenName: 'John',
        familyName: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updatedAt: new Date('2023-10-10T00:00:00.000Z'),
        email: 'john.doe@example.com',
        emailVerified: false,
      };

      const validatedUser = new UserInfoDto();
      Object.assign(validatedUser, foundUser);

      const selectQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(foundUser),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
      };

      dbServiceMock.getDatabase = jest.fn().mockReturnValue(dbMock);
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockResolvedValue(validatedUser);

      // Act
      const result = await authRepository.findUser(userInfo);

      // Assert
      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('users');
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'userId',
        '=',
        userInfo.sub,
      );
      expect(selectQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        expect.any(Function),
      );

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        UserInfoDto,
        foundUser,
      );
      expect(result).toBe(validatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      // Arrange
      const userInfo: Auth0UserInfoDto = {
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

      const selectQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockImplementation((onNotFound) => {
          if (onNotFound) {
            return Promise.reject(onNotFound());
          }
          return Promise.reject(new Error('User not found'));
        }),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
      };

      dbServiceMock.getDatabase = jest.fn().mockReturnValue(dbMock);

      // Act & Assert
      await expect(authRepository.findUser(userInfo)).rejects.toThrow(
        NotFoundException,
      );

      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('users');
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'userId',
        '=',
        userInfo.sub,
      );
      expect(selectQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it('should throw an error if validation fails', async () => {
      // Arrange
      const userInfo: Auth0UserInfoDto = {
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

      const foundUser = {
        userId: 'auth0|123456',
        givenName: 'John',
        familyName: 'Doe',
        nickname: 'johnny',
        name: 'John Doe',
        picture: 'http://example.com/picture.jpg',
        updatedAt: '2023-10-10T00:00:00.000Z',
        email: 'john.doe@example.com',
        emailVerified: true,
      };

      const selectQueryMock = {
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue(foundUser),
      };

      const dbMock = {
        selectFrom: jest.fn().mockReturnValue(selectQueryMock),
      };

      dbServiceMock.getDatabase = jest.fn().mockReturnValue(dbMock);

      const validationError = new Error('Validation failed');
      validationServiceMock.transformAndValidate = jest
        .fn()
        .mockRejectedValue(validationError);

      // Act & Assert
      await expect(authRepository.findUser(userInfo)).rejects.toThrow(
        validationError,
      );

      expect(dbServiceMock.getDatabase).toHaveBeenCalled();
      expect(dbMock.selectFrom).toHaveBeenCalledWith('users');
      expect(selectQueryMock.selectAll).toHaveBeenCalled();
      expect(selectQueryMock.where).toHaveBeenCalledWith(
        'userId',
        '=',
        userInfo.sub,
      );
      expect(selectQueryMock.executeTakeFirstOrThrow).toHaveBeenCalledWith(
        expect.any(Function),
      );

      expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
        UserInfoDto,
        foundUser,
      );
    });
  });
});
