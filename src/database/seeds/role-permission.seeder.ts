import { RolePermissionRepository } from '../../modules/role-permissions/repositories/role-permission.repository';
import { PermissionQueryRepository } from '../../modules/permissions/repositories/permission.query-repository';
import { TransactionService } from '../../common/transaction/transaction.service';
import { EntityManager } from 'typeorm';

/**
 * Assigns ALL permissions in the system to the given role.
 * If a manager is passed, it will use it. Otherwise, it opens a new transaction.
 */
export async function assignAllPermissionsToRole(
  roleId: number,
  rolePermissionRepository: RolePermissionRepository,
  permissionQueryRepository: PermissionQueryRepository,
  manager: EntityManager,
): Promise<number> {
  const doAssign = async (m: EntityManager) => {
    const permissions = await permissionQueryRepository.findMany(
      { order: { id: 'ASC' } },
      m,
    );
    console.log(`Found ${permissions.length} permission(s) in the system to assign to role ${roleId}.`);
    if (permissions.length === 0) {
      console.log('No permissions found. Run permissions:generate first.');
      return 0;
    }

    let assigned = 0;
    for (const permission of permissions) {
      const exists = await rolePermissionRepository.exists(
        roleId,
        permission.id,
        m,
      );
      if (!exists) {
        await rolePermissionRepository.add(roleId, permission.id, m);
        assigned++;
      }
    }
    console.log(
      `Assigned ${assigned} permission(s) to role ${roleId} (${permissions.length} total in system).`,
    );
    return assigned;
  };

  return doAssign(manager); // ใช้ transaction ภายนอก
}

/**
 * Assigns only permissions whose permissionCode starts with one of the given prefixes.
 */
export async function assignPermissionsToRoleByPrefixes(
  roleId: number,
  prefixes: string[],
  rolePermissionRepository: RolePermissionRepository,
  permissionQueryRepository: PermissionQueryRepository,
  manager: EntityManager,
): Promise<number> {
  const doAssign = async (m: EntityManager) => {
    const allPermissions = await permissionQueryRepository.findMany(
      { order: { id: 'ASC' } },
      m,
    );
    const toAssign = allPermissions.filter((p) =>
      prefixes.some((prefix) => p.permissionCode.startsWith(prefix)),
    );

    if (toAssign.length === 0) {
      console.log(
        `No permissions match prefixes [${prefixes.join(', ')}] for role ${roleId}.`,
      );
      return 0;
    }

    let assigned = 0;
    for (const permission of toAssign) {
      const exists = await rolePermissionRepository.exists(
        roleId,
        permission.id,
        m,
      );
      if (!exists) {
        await rolePermissionRepository.add(roleId, permission.id, m);
        assigned++;
      }
    }

    console.log(
      `Assigned ${assigned} permission(s) to role ${roleId} by prefixes [${prefixes.join(', ')}] (${toAssign.length} matched).`,
    );
    return assigned;
  };

  return doAssign(manager);
}

/**
 * ตรวจว่า permission นี้ merchant role เข้าถึงได้หรือไม่
 * รูปแบบ permissionCode: "{controllerPath}:{methodName}"
 * - methodName ขึ้นต้นด้วย "admin" → admin-only (merchant เข้าไม่ได้)
 * - อื่นๆ (merchant... หรือ shared) → merchant เข้าได้
 */
export function isMerchantAccessible(permissionCode: string): boolean {
  const methodName = permissionCode.split(':')[1] ?? '';
  return !methodName.startsWith('admin');
}

/**
 * Assigns permissions accessible to merchant roles (non-admin methods) to the given role.
 */
export async function assignMerchantPermissionsToRole(
  roleId: number,
  rolePermissionRepository: RolePermissionRepository,
  permissionQueryRepository: PermissionQueryRepository,
  manager: EntityManager,
): Promise<number> {
  const doAssign = async (m: EntityManager) => {
    const allPermissions = await permissionQueryRepository.findMany(
      { order: { id: 'ASC' } },
      m,
    );
    const toAssign = allPermissions.filter((p) =>
      isMerchantAccessible(p.permissionCode),
    );

    if (toAssign.length === 0) {
      console.log(`No merchant-accessible permissions found for role ${roleId}.`);
      return 0;
    }

    let assigned = 0;
    for (const permission of toAssign) {
      const exists = await rolePermissionRepository.exists(
        roleId,
        permission.id,
        m,
      );
      if (!exists) {
        await rolePermissionRepository.add(roleId, permission.id, m);
        assigned++;
      }
    }

    console.log(
      `Assigned ${assigned} merchant-accessible permission(s) to role ${roleId} (${toAssign.length} matched out of ${allPermissions.length} total).`,
    );
    return assigned;
  };

  return doAssign(manager);
}

/**
 * Legacy: assign all permissions to one role. Use assignAllPermissionsToRole instead.
 * @deprecated Use assignAllPermissionsToRole with SeededRoles from role.seeder
 */
export async function runRolePermissionSeeder(
  roleId: number,
  rolePermissionRepository: RolePermissionRepository,
  permissionQueryRepository: PermissionQueryRepository,
  manager: EntityManager,
): Promise<number> {
  return assignAllPermissionsToRole(
    roleId,
    rolePermissionRepository,
    permissionQueryRepository,
    manager,
  );
}
