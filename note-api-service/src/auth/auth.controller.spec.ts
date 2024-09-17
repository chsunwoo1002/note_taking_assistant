import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtDto } from './dto/jwt.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should call authService.signUp with SignUpDto and return the result', async () => {
      const signUpDto: SignUpDto = {
        accessToken: 'test-token',
      };
      const jwtDto: JwtDto = {
        accessToken: 'mock-token',
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(jwtDto);

      const result = await authController.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(jwtDto);
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn with SignInDto and return the result', async () => {
      const signInDto: SignInDto = {
        accessToken: 'mock-token',
      };

      const expectedResult: JwtDto = { accessToken: 'test-token' };

      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      const result = await authController.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
