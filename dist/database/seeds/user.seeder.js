"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPERADMIN_DEFAULT_PASSWORD = exports.SUPERADMIN_EMAIL = void 0;
exports.runUserSeeder = runUserSeeder;
const password_util_1 = require("../../common/utils/password.util");
exports.SUPERADMIN_EMAIL = 'superadmin@admin.com';
exports.SUPERADMIN_DEFAULT_PASSWORD = 'SuperAdmin@123';
async function runUserSeeder(userRepository, roleId, password = exports.SUPERADMIN_DEFAULT_PASSWORD, manager) {
    const existing = await userRepository.findOneBy({ email: exports.SUPERADMIN_EMAIL }, manager);
    if (existing) {
        console.log(`User "${exports.SUPERADMIN_EMAIL}" already exists.`);
        return existing;
    }
    const passwordHash = await (0, password_util_1.hashPassword)(password);
    const user = await userRepository.create({
        email: exports.SUPERADMIN_EMAIL,
        passwordHash,
        fullName: 'Super Admin',
        roleId,
        isActive: true,
    }, manager);
    console.log(`User "${exports.SUPERADMIN_EMAIL}" created (password: ${password}).`);
    return user;
}
//# sourceMappingURL=user.seeder.js.map