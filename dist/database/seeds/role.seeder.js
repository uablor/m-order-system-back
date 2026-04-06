"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLOYEE_MERCHANT_ROLE_NAME = exports.ADMIN_MERCHANT_ROLE_NAME = exports.ADMIN_ROLE_NAME = exports.SUPERADMIN_ROLE_NAME = void 0;
exports.runRoleSeeder = runRoleSeeder;
exports.SUPERADMIN_ROLE_NAME = 'superadmin';
exports.ADMIN_ROLE_NAME = 'admin';
exports.ADMIN_MERCHANT_ROLE_NAME = 'admin_merchant';
exports.EMPLOYEE_MERCHANT_ROLE_NAME = 'employee_merchant';
const ROLES_TO_SEED = [
    { roleName: exports.SUPERADMIN_ROLE_NAME, description: 'Super administrator with all permissions' },
    { roleName: exports.ADMIN_ROLE_NAME, description: 'Administrator with all permissions' },
    { roleName: exports.ADMIN_MERCHANT_ROLE_NAME, description: 'Administrator of a merchant' },
    { roleName: exports.EMPLOYEE_MERCHANT_ROLE_NAME, description: 'Employee of a merchant' },
];
async function runRoleSeeder(roleRepository, manager) {
    const result = {};
    for (const { roleName, description } of ROLES_TO_SEED) {
        let role = await roleRepository.findOneBy({ roleName });
        if (role) {
            console.log(`Role "${roleName}" already exists.`);
        }
        else {
            role = await roleRepository.create({
                roleName,
                description,
            });
            console.log(`Role "${roleName}" created.`);
        }
        const key = roleName;
        result[key] = role;
    }
    return result;
}
//# sourceMappingURL=role.seeder.js.map