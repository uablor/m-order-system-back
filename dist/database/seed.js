"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app/app.module");
const permission_generator_service_1 = require("../modules/permissions/services/permission-generator.service");
const role_repository_1 = require("../modules/roles/repositories/role.repository");
const permission_repository_1 = require("../modules/permissions/repositories/permission.repository");
const role_permission_repository_1 = require("../modules/role-permissions/repositories/role-permission.repository");
const user_repository_1 = require("../modules/users/repositories/user.repository");
const transaction_service_1 = require("../common/transaction/transaction.service");
const role_seeder_1 = require("./seeds/role.seeder");
const role_permission_seeder_1 = require("./seeds/role-permission.seeder");
const user_seeder_1 = require("./seeds/user.seeder");
const permission_seeder_1 = require("./seeds/permission.seeder");
const permission_query_repository_1 = require("../modules/permissions/repositories/permission.query-repository");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    const transactionService = app.get(transaction_service_1.TransactionService);
    const generator = app.get(permission_generator_service_1.PermissionGeneratorService);
    const permissionRepository = app.get(permission_repository_1.PermissionRepository);
    const roleRepository = app.get(role_repository_1.RoleRepository);
    const rolePermissionRepository = app.get(role_permission_repository_1.RolePermissionRepository);
    const permissionQueryRepository = app.get(permission_query_repository_1.PermissionQueryRepository);
    const userRepository = app.get(user_repository_1.UserRepository);
    try {
        await transactionService.run(async (manager) => {
            await generator.generateFromControllers();
            await (0, permission_seeder_1.runPermissionSeeder)(permissionRepository, manager);
            const roles = await (0, role_seeder_1.runRoleSeeder)(roleRepository, manager);
            if (!roles.superadmin) {
                throw new Error('Failed to get or create superadmin role');
            }
            await (0, role_permission_seeder_1.assignAllPermissionsToRole)(roles.superadmin.id, rolePermissionRepository, permissionQueryRepository, manager);
            await (0, role_permission_seeder_1.assignAllPermissionsToRole)(roles.admin.id, rolePermissionRepository, permissionQueryRepository, manager);
            await (0, role_permission_seeder_1.assignMerchantPermissionsToRole)(roles.admin_merchant.id, rolePermissionRepository, permissionQueryRepository, manager);
            await (0, role_permission_seeder_1.assignMerchantPermissionsToRole)(roles.employee_merchant.id, rolePermissionRepository, permissionQueryRepository, manager);
            await (0, user_seeder_1.runUserSeeder)(userRepository, roles.superadmin.id, user_seeder_1.SUPERADMIN_DEFAULT_PASSWORD, manager);
        });
        console.log('Seed completed:\n- roles (superadmin, admin, admin_merchant, employee_merchant) with permissions\n- user "%s" as %s', user_seeder_1.SUPERADMIN_EMAIL, role_seeder_1.SUPERADMIN_ROLE_NAME);
    }
    catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
seed();
//# sourceMappingURL=seed.js.map