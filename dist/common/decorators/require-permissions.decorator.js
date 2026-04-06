"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAutoPermission = exports.RequirePermissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const RequirePermissions = (options) => {
    const normalizedOptions = Array.isArray(options)
        ? { permissions: options }
        : options;
    return (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, normalizedOptions);
};
exports.RequirePermissions = RequirePermissions;
const RequireAutoPermission = () => (0, exports.RequirePermissions)({ auto: true });
exports.RequireAutoPermission = RequireAutoPermission;
//# sourceMappingURL=require-permissions.decorator.js.map