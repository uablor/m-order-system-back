"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROLE = void 0;
exports.canCreateRole = canCreateRole;
exports.canAssignPermission = canAssignPermission;
exports.canUpdateUser = canUpdateUser;
exports.canDeleteUser = canDeleteUser;
exports.ADMIN_ROLE = 'ADMIN';
function canCreateRole(user) {
    return user?.roleName === exports.ADMIN_ROLE;
}
function canAssignPermission(user) {
    return user?.roleName === exports.ADMIN_ROLE;
}
function canUpdateUser(user, targetUserId) {
    return user?.roleName === exports.ADMIN_ROLE || user?.userId === targetUserId;
}
function canDeleteUser(user, targetUserId) {
    return user?.roleName === exports.ADMIN_ROLE || user?.userId === targetUserId;
}
//# sourceMappingURL=role.policy.js.map