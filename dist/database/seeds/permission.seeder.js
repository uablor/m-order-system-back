"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_PERMISSIONS = exports.SUPERADMIN_PERMISSIONS = void 0;
exports.runPermissionSeeder = runPermissionSeeder;
const roles = ['superadmin', 'admin'];
const actions = ['create', 'read', 'update', 'delete'];
const permissions = roles.flatMap((role) => actions.map((action) => `${role}-${action}`));
exports.SUPERADMIN_PERMISSIONS = permissions.filter((perm) => perm.startsWith('superadmin-'));
exports.ADMIN_PERMISSIONS = permissions.filter((perm) => perm.startsWith('admin-'));
async function runPermissionSeeder(permissionRepo, manager) {
    for (const permissionCode of permissions) {
        const exists = await permissionRepo.findOneBy({
            permissionCode,
        }, manager);
        if (!exists) {
            await permissionRepo.create({
                permissionCode,
                description: `${permissionCode} permission`,
            }, manager);
            console.log('Permission seeder completed', permissionCode);
        }
    }
}
//# sourceMappingURL=permission.seeder.js.map