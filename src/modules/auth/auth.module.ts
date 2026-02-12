import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../users/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthCommandService } from './services/auth-command.service';
import { AuthQueryService } from './services/auth-query.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const SEVEN_DAYS_SEC = 7 * 24 * 60 * 60;

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('app.jwt.secret', { infer: true }) ??
          'change-me-in-production',
        signOptions: {
          expiresIn:
            config.get<number>('app.jwt.expiresInSeconds', { infer: true }) ??
            SEVEN_DAYS_SEC,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthCommandService, AuthQueryService, JwtStrategy],
  exports: [AuthCommandService, AuthQueryService, JwtModule],
})
export class AuthModule {}
