"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const require_permissions_decorator_1 = require("../decorators/require-permissions.decorator");
const constants_1 = require("@nestjs/common/constants");
let PermissionsGuard = class PermissionsGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(require_permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication required');
        }
        if (requiredPermissions.permissions && requiredPermissions.permissions.length > 0) {
            return this.checkManualPermissions(user, requiredPermissions.permissions);
        }
        if (requiredPermissions.auto) {
            return this.checkAutoPermission(context, user);
        }
        return true;
    }
    checkManualPermissions(user, permissions) {
        const userPermissions = user.permissions || [];
        const hasAllPermissions = permissions.every(permission => userPermissions.includes(permission));
        if (!hasAllPermissions) {
            throw new common_1.ForbiddenException(`Required permissions: ${permissions.join(', ')}. User permissions: ${userPermissions.join(', ') || 'none'}`);
        }
        return true;
    }
    checkAutoPermission(context, user) {
        const controller = context.getClass();
        const handler = context.getHandler();
        const controllerPath = this.getControllerPath(controller);
        if (!controllerPath) {
            return true;
        }
        const methodName = handler.name;
        const permissionCode = `${controllerPath}:${methodName}`;
        const userPermissions = user.permissions || [];
        const hasPermission = userPermissions.includes(permissionCode);
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`Required permission: ${permissionCode}. User permissions: ${userPermissions.join(', ') || 'none'}`);
        }
        return true;
    }
    getControllerPath(controllerClass) {
        const path = Reflect.getMetadata(constants_1.PATH_METADATA, controllerClass);
        if (path == null || path === '')
            return null;
        return String(path).replace(/^\//, '').toLowerCase();
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map