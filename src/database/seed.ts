import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermissionGeneratorService } from '../modules/permissions/services/permission-generator.service';
import { RoleRepository } from '../modules/roles/repositories/role.repository';
import { PermissionQueryRepository } from '../modules/permissions/repositories/permission.query-repository';
import { RolePermissionRepository } from '../modules/role-permissions/repositories/role-permission.repository';
import { UserRepository } from '../modules/users/repositories/user.repository';
import { MerchantRepository } from '../modules/merchants/repositories/merchant.repository';
import { CustomerRepository } from '../modules/customers/repositories/customer.repository';
import { TransactionService } from '../common/transaction/transaction.service';
import { runRoleSeeder, SUPERADMIN_ROLE_NAME } from './seeds/role.seeder';
import {
  assignAllPermissionsToRole,
  assignPermissionsToRoleByPrefixes,
  MERCHANT_PERMISSION_PREFIXES,
} from './seeds/role-permission.seeder';
import { runUserSeeder, SUPERADMIN_EMAIL } from './seeds/user.seeder';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_MERCHANT1_EMAIL,
  DEMO_MERCHANT1_PASSWORD,
  DEMO_MERCHANT2_EMAIL,
  DEMO_MERCHANT2_PASSWORD,
  runDemoDataSeeder,
} from './seeds/demo-data.seeder';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    // 1. Ensure all permissions exist (from controller methods)
    const generator = app.get(PermissionGeneratorService);
    await generator.generateFromControllers();

    // 2. Create all roles if not exists (superadmin, admin, admin_merchant, employee_merchant)
    const roleRepository = app.get(RoleRepository);
    const roles = await runRoleSeeder(roleRepository);
    if (!roles.superadmin) {
      throw new Error('Failed to get or create superadmin role');
    }

    const rolePermissionRepository = app.get(RolePermissionRepository);
    const permissionQueryRepository = app.get(PermissionQueryRepository);
    const transactionService = app.get(TransactionService);

    // 3. Assign permissions for each role
    await assignAllPermissionsToRole(
      roles.superadmin.id,
      rolePermissionRepository,
      permissionQueryRepository,
      transactionService,
    );
    await assignAllPermissionsToRole(
      roles.admin.id,
      rolePermissionRepository,
      permissionQueryRepository,
      transactionService,
    );
    await assignPermissionsToRoleByPrefixes(
      roles.admin_merchant.id,
      [...MERCHANT_PERMISSION_PREFIXES],
      rolePermissionRepository,
      permissionQueryRepository,
      transactionService,
    );
    await assignPermissionsToRoleByPrefixes(
      roles.employee_merchant.id,
      [...MERCHANT_PERMISSION_PREFIXES],
      rolePermissionRepository,
      permissionQueryRepository,
      transactionService,
    );

    // 4. Create user superadmin@admin.com with superadmin role if not exists
    const userRepository = app.get(UserRepository);
    await runUserSeeder(userRepository, roles.superadmin.id);

    // 5. Demo data for testing (admin + merchants + customers)
    const merchantRepository = app.get(MerchantRepository);
    const customerRepository = app.get(CustomerRepository);
    await runDemoDataSeeder(userRepository, merchantRepository, customerRepository, roles);

    console.log(
      'Seed completed:\n- roles (superadmin, admin, admin_merchant, employee_merchant) with permissions\n- user "%s" as %s\n- demo admin "%s" (password: %s)\n- demo merchant owners: "%s" (password: %s), "%s" (password: %s)\n- demo customers created for 2 merchants',
      SUPERADMIN_EMAIL,
      SUPERADMIN_ROLE_NAME,
      DEMO_ADMIN_EMAIL,
      DEMO_ADMIN_PASSWORD,
      DEMO_MERCHANT1_EMAIL,
      DEMO_MERCHANT1_PASSWORD,
      DEMO_MERCHANT2_EMAIL,
      DEMO_MERCHANT2_PASSWORD,
    );
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
