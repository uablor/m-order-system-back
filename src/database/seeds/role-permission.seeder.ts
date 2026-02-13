import { RolePermissionRepository } from '../../modules/role-permissions/repositories/role-permission.repository';
import { PermissionQueryRepository } from '../../modules/permissions/repositories/permission.query-repository';
import { TransactionService } from '../../common/transaction/transaction.service';

/**
 * Assigns ALL permissions in the system to the given role.
 */
export async function assignAllPermissionsToRole(
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

  console.log(`Assigned ${assigned} permission(s) to role ${roleId} (${permissions.length} total in system).`);
  return assigned;
}

/**
 * Assigns only permissions whose permissionCode starts with one of the given prefixes.
 * Example: prefixes ['orders:', 'arrivals:'] assigns orders:create, orders:getList, arrivals:create, etc.
 */
export async function assignPermissionsToRoleByPrefixes(
  roleId: number,
  prefixes: string[],
  rolePermissionRepository: RolePermissionRepository,
  permissionQueryRepository: PermissionQueryRepository,
  transactionService: TransactionService,
): Promise<number> {
  const allPermissions = await permissionQueryRepository.findMany({
    order: { id: 'ASC' as const },
  });
  const toAssign = allPermissions.filter((p) =>
    prefixes.some((prefix) => p.permissionCode.startsWith(prefix)),
  );
  if (toAssign.length === 0) {
    console.log(`No permissions match prefixes [${prefixes.join(', ')}] for role ${roleId}.`);
    return 0;
  }

  let assigned = 0;
  await transactionService.run(async (manager) => {
    for (const permission of toAssign) {
      const exists = await rolePermissionRepository.exists(roleId, permission.id, manager);
      if (!exists) {
        await rolePermissionRepository.add(roleId, permission.id, manager);
        assigned++;
      }
    }
  });

  console.log(
    `Assigned ${assigned} permission(s) to role ${roleId} by prefixes [${prefixes.join(', ')}] (${toAssign.length} matched).`,
  );
  return assigned;
}

/** Prefixes for merchant-scoped permissions (orders, arrivals, customers, etc.). */
export const MERCHANT_PERMISSION_PREFIXES = [
  'orders:',
  'order-items:',
  'customer-orders:',
  'customer-order-items:',
  'arrivals:',
  'arrival-items:',
  'notifications:',
  'customers:',
  'merchants:',
] as const;

/**
 * Legacy: assign all permissions to one role. Use assignAllPermissionsToRole instead.
 * @deprecated Use assignAllPermissionsToRole with SeededRoles from role.seeder
 */
export async function runRolePermissionSeeder(
  roleId: number,
  rolePermissionRepository: RolePermissionRepository,
  permissionQueryRepository: PermissionQueryRepository,
  transactionService: TransactionService,
): Promise<number> {
  return assignAllPermissionsToRole(
    roleId,
    rolePermissionRepository,
    permissionQueryRepository,
    transactionService,
  );
}
