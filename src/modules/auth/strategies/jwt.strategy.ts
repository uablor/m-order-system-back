import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { UserQueryService } from '../../users/services/user-query.service';

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userQueryService: UserQueryService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwt.secret', { infer: true }) ?? 'change-me-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserPayload> {
    const user = await this.userQueryService.getById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return {
      userId: payload.userId,
      email: payload.email,
      roleId: payload.roleId,
      roleName: user.roleName ?? payload.roleName,
    };
  }
}
