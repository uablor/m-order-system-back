import { RolePermissionRepository } from '../../modules/role-permissions/repositories/role-permission.repository';
import { PermissionQueryRepository } from '../../modules/permissions/repositories/permission.query-repository';
import { TransactionService } from '../../common/transaction/transaction.service';

export async function runRolePermissionSeeder(
  roleId: number,
  rolePermissionRepository: RolePermissionRepository,
  permissionQueryRepository: PermissionQueryRepository,
  transactionService: TransactionService,
): Promise<number> {
  const permissions = await permissionQueryRepository.findMany({
    order: { id: 'ASC' as const },
  });
  if (permissions.length === 0) {
    console.log('No permissions found. Run permissions:generate first.');
    return 0;
  }

  let assigned = 0;
  await transactionService.run(async (manager) => {
    for (const permission of permissions) {
      const exists = await rolePermissionRepository.exists(roleId, permission.id, manager);
      if (!exists) {
        await rolePermissionRepository.add(roleId, permission.id, manager);
        assigned++;
      }
    }
  });

  console.log(`Assigned ${assigned} permission(s) to role (${permissions.length} total in system).`);
  return assigned;
}
