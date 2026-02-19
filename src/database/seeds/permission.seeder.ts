import { PermissionRepository } from 'src/modules/permissions/repositories/permission.repository';
import { EntityManager } from 'typeorm';

const roles = ['superadmin', 'admin'];
const actions = ['create', 'read', 'update', 'delete'];
const permissions = roles.flatMap((role) =>
  actions.map((action) => `${role}-${action}`),
);
  
export const SUPERADMIN_PERMISSIONS = permissions.filter((perm) =>
  perm.startsWith('superadmin-'),
);
export const ADMIN_PERMISSIONS = permissions.filter((perm) =>
  perm.startsWith('admin-'),
);

export async function runPermissionSeeder(
  permissionRepo: PermissionRepository,
  manager?: EntityManager,
): Promise<void> {
  for (const permissionCode of permissions) {
    const exists = await permissionRepo.findOneBy(
      {
        permissionCode,
      },
      manager,
    );

    if (!exists) {
      await permissionRepo.create(
        {
          permissionCode,
          description: `${permissionCode} permission`,
        },
        manager,
      );
      console.log('Permission seeder completed', permissionCode);
    }
  }
}
