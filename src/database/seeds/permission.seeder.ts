import { PermissionOrmEntity } from 'src/modules/permissions/entities/permission.orm-entity';
import { PermissionRepository } from 'src/modules/permissions/repositories/permission.repository';
import { EntityManager, Repository } from 'typeorm';

export async function runPermissionSeeder(
  permissionRepo: PermissionRepository,
  manager?: EntityManager,
): Promise<void> {
  const roles = ['superadmin', 'admin'];
  const actions = ['create', 'read', 'update', 'delete'];
  const permissions = roles.flatMap((role) =>
    actions.map((action) => `${role}-${action}`),
  );

  for (const permissionCode of permissions) {
    const exists = await permissionRepo.findOneBy(
      {
        permissionCode,
      },
      manager,
    );

    if (!exists) {
      await permissionRepo.create({
        permissionCode,
        description: `${permissionCode} permission`,
      },
      manager,
    );
      console.log('Permission seeder completed', permissionCode);
    }
  }
}
