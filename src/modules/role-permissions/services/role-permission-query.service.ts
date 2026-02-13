import { Injectable } from '@nestjs/common';
import { RolePermissionQueryRepository } from '../repositories/role-permission.query-repository';
import { PermissionResponseDto } from '../../permissions/dto/permission-response.dto';
import type { ResponseInterface } from '../../../common/base/interfaces/response.interface';
import { createResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class RolePermissionQueryService {
  constructor(private readonly rolePermissionQueryRepository: RolePermissionQueryRepository) {}

  async getPermissionsByRoleId(roleId: number): Promise<ResponseInterface<PermissionResponseDto>> {
    const permissions = await this.rolePermissionQueryRepository.findPermissionsByRoleId(roleId);
    const results = permissions.map((p) => ({
      id: p.id,
      permissionCode: p.permissionCode,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    return createResponse(results);
  }
}
