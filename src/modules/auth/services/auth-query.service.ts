import { Injectable, NotFoundException } from '@nestjs/common';
import { UserQueryService } from '../../users/services/user-query.service';
import type { AuthUserDto } from '../dto/auth-response.dto';

@Injectable()
export class AuthQueryService {
  constructor(private readonly userQueryService: UserQueryService) {}

  async getProfile(userId: number): Promise<AuthUserDto> {
    const user = await this.userQueryService.getByIdOrFail(userId);
    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId,
      roleName: user.roleName,
    };
  }
}
