import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { ValidationService } from 'src/validation/validation.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, ValidationService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
