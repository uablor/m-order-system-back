import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermissionGeneratorService } from '../modules/permissions/services/permission-generator.service';
import { RoleRepository } from '../modules/roles/repositories/role.repository';
import { PermissionQueryRepository } from '../modules/permissions/repositories/permission.query-repository';
import { RolePermissionRepository } from '../modules/role-permissions/repositories/role-permission.repository';
import { UserRepository } from '../modules/users/repositories/user.repository';
import { TransactionService } from '../common/transaction/transaction.service';
import { runRoleSeeder, SUPERADMIN_ROLE_NAME } from './seeds/role.seeder';
import { runRolePermissionSeeder } from './seeds/role-permission.seeder';
import { runUserSeeder, SUPERADMIN_EMAIL } from './seeds/user.seeder';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    // 1. Ensure all permissions exist (from controller methods)
    const generator = app.get(PermissionGeneratorService);
    await generator.generateFromControllers();

    // 2. Create role "superadmin" if not exists
    const roleRepository = app.get(RoleRepository);
    const superadminRole = await runRoleSeeder(roleRepository);
    if (!superadminRole) {
      throw new Error('Failed to get or create superadmin role');
    }

    // 3. Assign ALL permissions to superadmin role
    const rolePermissionRepository = app.get(RolePermissionRepository);
    const permissionQueryRepository = app.get(PermissionQueryRepository);
    const transactionService = app.get(TransactionService);
    await runRolePermissionSeeder(
      superadminRole.id,
      rolePermissionRepository,
      permissionQueryRepository,
      transactionService,
    );

    // 4. Create user superadmin@admin.com with superadmin role if not exists
    const userRepository = app.get(UserRepository);
    await runUserSeeder(userRepository, superadminRole.id);

    console.log('Seed completed: role "%s", user "%s" with all permissions.', SUPERADMIN_ROLE_NAME, SUPERADMIN_EMAIL);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
