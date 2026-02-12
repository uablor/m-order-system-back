import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../../common/utils/password.util';
import { UserQueryRepository } from '../../users/repositories/user.query-repository';
import { LoginDto } from '../dto/login.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import type { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class AuthCommandService {
  constructor(
    private readonly userQueryRepository: UserQueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const entity = await this.userQueryRepository.repository.findOne({
      where: { email: dto.email },
      relations: ['role'],
    });
    if (!entity) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!entity.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }
    const match = await comparePassword(dto.password, entity.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload: CurrentUserPayload = {
      userId: entity.id,
      email: entity.email,
      roleId: entity.roleId,
      roleName: entity.role?.roleName,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      success: true,
      message: 'Login successful',
      access_token,
      user: {
        userId: entity.id,
        email: entity.email,
        fullName: entity.fullName,
        roleId: entity.roleId,
        roleName: entity.role?.roleName,
      },
    };
  }
}
