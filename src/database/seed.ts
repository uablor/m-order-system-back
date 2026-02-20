import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermissionGeneratorService } from '../modules/permissions/services/permission-generator.service';
import { RoleRepository } from '../modules/roles/repositories/role.repository';
import { PermissionRepository } from '../modules/permissions/repositories/permission.repository';
import { RolePermissionRepository } from '../modules/role-permissions/repositories/role-permission.repository';
import { UserRepository } from '../modules/users/repositories/user.repository';
import { TransactionService } from '../common/transaction/transaction.service';
import { runRoleSeeder, SUPERADMIN_ROLE_NAME } from './seeds/role.seeder';
import {
  assignAllPermissionsToRole,
  assignMerchantPermissionsToRole,
} from './seeds/role-permission.seeder';
import { runUserSeeder, SUPERADMIN_DEFAULT_PASSWORD, SUPERADMIN_EMAIL } from './seeds/user.seeder';
import { runPermissionSeeder } from './seeds/permission.seeder';
import { EntityManager } from 'typeorm';
import { PermissionQueryRepository } from 'src/modules/permissions/repositories/permission.query-repository';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const transactionService = app.get(TransactionService);
  const generator = app.get(PermissionGeneratorService);
  const permissionRepository = app.get(PermissionRepository);
  const roleRepository = app.get(RoleRepository);
  const rolePermissionRepository = app.get(RolePermissionRepository);
  const permissionQueryRepository = app.get(PermissionQueryRepository);
  const userRepository = app.get(UserRepository);

  try {
    await transactionService.run(async (manager: EntityManager) => {
      // 1️⃣ Generate permissions from controllers
      await generator.generateFromControllers();

      // 2️⃣ Seed manual permissions (superadmin/admin CRUD)
      await runPermissionSeeder(permissionRepository, manager);

      // 3️⃣ Create roles
      const roles = await runRoleSeeder(roleRepository, manager);
      if (!roles.superadmin) {
        throw new Error('Failed to get or create superadmin role');
      }

    await assignAllPermissionsToRole(
    roles.superadmin.id,
    rolePermissionRepository,
    permissionQueryRepository,
    manager,
  );
  await assignAllPermissionsToRole(
    roles.admin.id,
    rolePermissionRepository,
    permissionQueryRepository,
    manager,
  );

  // 5️⃣ Assign merchant-related permissions
  await assignMerchantPermissionsToRole(
    roles.admin_merchant.id,
    rolePermissionRepository,
    permissionQueryRepository,
    manager,
  );
  await assignMerchantPermissionsToRole(
    roles.employee_merchant.id,
    rolePermissionRepository,
    permissionQueryRepository,
    manager,
  );
      // 6️⃣ Create superadmin user
      await runUserSeeder(userRepository, roles.superadmin.id,SUPERADMIN_DEFAULT_PASSWORD,  manager);
    });

    console.log(
      'Seed completed:\n- roles (superadmin, admin, admin_merchant, employee_merchant) with permissions\n- user "%s" as %s',
      SUPERADMIN_EMAIL,
      SUPERADMIN_ROLE_NAME,
    );
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
