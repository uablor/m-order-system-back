import { Injectable, NotFoundException } from '@nestjs/common';
import { UserQueryRepository } from '../../users/repositories/user.query-repository';
import { RolePermissionQueryService } from '../../role-permissions/services/role-permission-query.service';
import type { AuthUserDto } from '../dto/auth-response.dto';
import type { ResponseInterface } from '../../../common/base/interfaces/response.interface';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class AuthQueryService {
  constructor(
    private readonly userQueryRepository: UserQueryRepository,
    private readonly rolePermissionQueryService: RolePermissionQueryService,
  ) {}

  async getProfile(userId: number): Promise<ResponseInterface<AuthUserDto>> {
    const entity = await this.userQueryRepository.repository.findOne({
      where: { id: userId },
      relations: ['role', 'merchant'],
    });
    if (!entity) throw new NotFoundException('User not found');
    if (!entity.isActive) throw new NotFoundException('User not found');

    const merchantId = entity.merchantId ?? entity.merchant?.id ?? null;
    const permResp = await this.rolePermissionQueryService.getPermissionsByRoleId(entity.roleId);
    const permissionCodes = permResp.results?.map((p) => p.permissionCode) ?? [];

    const profile: AuthUserDto = {
      userId: entity.id,
      email: entity.email,
      fullName: entity.fullName,
      roleId: entity.roleId,
      roleName: entity.role?.roleName,
      merchantId: merchantId ?? undefined,
      permissions: permissionCodes,
    };
    return createSingleResponse(profile);
  }
}
