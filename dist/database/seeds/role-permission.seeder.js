"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAllPermissionsToRole = assignAllPermissionsToRole;
exports.assignPermissionsToRoleByPrefixes = assignPermissionsToRoleByPrefixes;
exports.isMerchantAccessible = isMerchantAccessible;
exports.assignMerchantPermissionsToRole = assignMerchantPermissionsToRole;
exports.runRolePermissionSeeder = runRolePermissionSeeder;
async function assignAllPermissionsToRole(roleId, rolePermissionRepository, permissionQueryRepository, manager) {
    const doAssign = async (m) => {
        const permissions = await permissionQueryRepository.findMany({ order: { id: 'ASC' } }, m);
        console.log(`Found ${permissions.length} permission(s) in the system to assign to role ${roleId}.`);
        if (permissions.length === 0) {
            console.log('No permissions found. Run permissions:generate first.');
            return 0;
        }
        let assigned = 0;
        for (const permission of permissions) {
            const exists = await rolePermissionRepository.exists(roleId, permission.id, m);
            if (!exists) {
                await rolePermissionRepository.add(roleId, permission.id, m);
                assigned++;
            }
        }
        console.log(`Assigned ${assigned} permission(s) to role ${roleId} (${permissions.length} total in system).`);
        return assigned;
    };
    return doAssign(manager);
}
async function assignPermissionsToRoleByPrefixes(roleId, prefixes, rolePermissionRepository, permissionQueryRepository, manager) {
    const doAssign = async (m) => {
        const allPermissions = await permissionQueryRepository.findMany({ order: { id: 'ASC' } }, m);
        const toAssign = allPermissions.filter((p) => prefixes.some((prefix) => p.permissionCode.startsWith(prefix)));
        if (toAssign.length === 0) {
            console.log(`No permissions match prefixes [${prefixes.join(', ')}] for role ${roleId}.`);
            return 0;
        }
        let assigned = 0;
        for (const permission of toAssign) {
            const exists = await rolePermissionRepository.exists(roleId, permission.id, m);
            if (!exists) {
                await rolePermissionRepository.add(roleId, permission.id, m);
                assigned++;
            }
        }
        console.log(`Assigned ${assigned} permission(s) to role ${roleId} by prefixes [${prefixes.join(', ')}] (${toAssign.length} matched).`);
        return assigned;
    };
    return doAssign(manager);
}
function isMerchantAccessible(permissionCode) {
    const methodName = permissionCode.split(':')[1] ?? '';
    return !methodName.startsWith('admin');
}
async function assignMerchantPermissionsToRole(roleId, rolePermissionRepository, permissionQueryRepository, manager) {
    const doAssign = async (m) => {
        const allPermissions = await permissionQueryRepository.findMany({ order: { id: 'ASC' } }, m);
        const toAssign = allPermissions.filter((p) => isMerchantAccessible(p.permissionCode));
        if (toAssign.length === 0) {
            console.log(`No merchant-accessible permissions found for role ${roleId}.`);
            return 0;
        }
        let assigned = 0;
        for (const permission of toAssign) {
            const exists = await rolePermissionRepository.exists(roleId, permission.id, m);
            if (!exists) {
                await rolePermissionRepository.add(roleId, permission.id, m);
                assigned++;
            }
        }
        console.log(`Assigned ${assigned} merchant-accessible permission(s) to role ${roleId} (${toAssign.length} matched out of ${allPermissions.length} total).`);
        return assigned;
    };
    return doAssign(manager);
}
async function runRolePermissionSeeder(roleId, rolePermissionRepository, permissionQueryRepository, manager) {
    return assignAllPermissionsToRole(roleId, rolePermissionRepository, permissionQueryRepository, manager);
}
//# sourceMappingURL=role-permission.seeder.js.map