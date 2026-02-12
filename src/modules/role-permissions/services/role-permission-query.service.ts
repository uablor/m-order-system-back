import { Injectable } from '@nestjs/common';
import { RolePermissionQueryRepository } from '../repositories/role-permission.query-repository';
import { PermissionResponseDto } from '../../permissions/dto/permission-response.dto';

@Injectable()
export class RolePermissionQueryService {
  constructor(private readonly rolePermissionQueryRepository: RolePermissionQueryRepository) {}

  async getPermissionsByRoleId(roleId: string): Promise<PermissionResponseDto[]> {
    const permissions = await this.rolePermissionQueryRepository.findPermissionsByRoleId(roleId);
    return permissions.map((p) => ({
      id: p.id,
      permissionCode: p.permissionCode,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }
}
