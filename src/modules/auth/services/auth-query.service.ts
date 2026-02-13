import { Injectable, NotFoundException } from '@nestjs/common';
import { UserQueryService } from '../../users/services/user-query.service';
import type { AuthUserDto } from '../dto/auth-response.dto';
import type { ResponseInterface } from '../../../common/base/interfaces/response.interface';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class AuthQueryService {
  constructor(private readonly userQueryService: UserQueryService) {}

  async getProfile(userId: number): Promise<ResponseInterface<AuthUserDto>> {
    const user = await this.userQueryService.getById(userId);
    if (!user) throw new NotFoundException('User not found');
    const profile: AuthUserDto = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId,
      roleName: user.roleName,
    };
    return createSingleResponse(profile);
  }
}
