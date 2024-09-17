import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidationService } from 'src/validation/validation.service';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { Request } from 'express';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtServiceMock: Partial<JwtService>;
  let configServiceMock: Partial<ConfigService>;
  let validationServiceMock: Partial<ValidationService>;
  let reflectorMock: Partial<Reflector>;

  beforeEach(() => {
    jwtServiceMock = {
      verifyAsync: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn(),
    };

    validationServiceMock = {
      transformAndValidate: jest.fn(),
    };

    reflectorMock = {
      getAllAndOverride: jest.fn(),
    };

    guard = new AuthGuard(
      jwtServiceMock as JwtService,
      configServiceMock as ConfigService,
      validationServiceMock as ValidationService,
      reflectorMock as Reflector,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access if route is public', async () => {
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(true);

    const context = {
      switchToHttp: () => ({
        getRequest: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(false);

    const request = {
      headers: {},
    } as Request;

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(false);

    const request = {
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    } as Request;

    jwtServiceMock.verifyAsync = jest
      .fn()
      .mockRejectedValue(new Error('Invalid token'));
    configServiceMock.get = jest.fn().mockReturnValue('testsecret');

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('invalidtoken', {
      secret: 'testsecret',
    });
  });

  it('should throw UnauthorizedException if validation fails', async () => {
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(false);

    const request = {
      headers: {
        authorization: 'Bearer validtoken',
      },
    } as Request;

    jwtServiceMock.verifyAsync = jest.fn().mockResolvedValue({ userId: '123' });
    validationServiceMock.transformAndValidate = jest
      .fn()
      .mockRejectedValue(new Error('Validation failed'));
    configServiceMock.get = jest.fn().mockReturnValue('testsecret');

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('validtoken', {
      secret: 'testsecret',
    });
    expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
      AuthenticatedUserDto,
      { userId: '123' },
    );
  });

  it('should allow access and set request.user if token is valid', async () => {
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(false);

    const request = {
      headers: {
        authorization: 'Bearer validtoken',
      },
    } as unknown as Request;

    const user: AuthenticatedUserDto = {
      userId: '123',
      iat: 0,
      exp: 0,
    };

    jwtServiceMock.verifyAsync = jest.fn().mockResolvedValue(user);
    validationServiceMock.transformAndValidate = jest
      .fn()
      .mockResolvedValue(user);
    configServiceMock.get = jest.fn().mockReturnValue('testsecret');

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('validtoken', {
      secret: 'testsecret',
    });
    expect(validationServiceMock.transformAndValidate).toHaveBeenCalledWith(
      AuthenticatedUserDto,
      user,
    );
  });
});
