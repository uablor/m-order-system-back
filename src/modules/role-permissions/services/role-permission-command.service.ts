import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { RoleRepository } from '../../roles/repositories/role.repository';
import { PermissionRepository } from '../../permissions/repositories/permission.repository';

@Injectable()
export class RolePermissionCommandService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async assign(roleId: number, permissionId: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const role = await this.roleRepository.findOneById(roleId, manager);
      if (!role) throw new NotFoundException('Role not found');
      const permission = await this.permissionRepository.findOneById(permissionId, manager);
      if (!permission) throw new NotFoundException('Permission not found');
      const exists = await this.rolePermissionRepository.exists(roleId, permissionId, manager);
      if (exists) throw new ConflictException('Permission already assigned to role');
      await this.rolePermissionRepository.add(roleId, permissionId, manager);
    });
  }

  async unassign(roleId: number, permissionId: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const removed = await this.rolePermissionRepository.remove(roleId, permissionId, manager);
      if (!removed) {
        throw new NotFoundException('Role permission assignment not found');
      }
    });
  }
}
