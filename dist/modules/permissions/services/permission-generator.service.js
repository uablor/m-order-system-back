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
exports.PermissionGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const constants_1 = require("@nestjs/common/constants");
const permission_repository_1 = require("../repositories/permission.repository");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const skip_auto_permission_decorator_1 = require("../../../common/decorators/skip-auto-permission.decorator");
let PermissionGeneratorService = class PermissionGeneratorService {
    discoveryService;
    reflector;
    permissionRepository;
    transactionService;
    constructor(discoveryService, reflector, permissionRepository, transactionService) {
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.permissionRepository = permissionRepository;
        this.transactionService = transactionService;
    }
    async generateFromControllers() {
        const permissions = this.discoverControllerPermissions();
        return this.transactionService.run(async (manager) => {
            const created = [];
            const skipped = [];
            for (const { permissionCode, description } of permissions) {
                const existing = await this.permissionRepository.findOneBy({ permissionCode }, manager);
                if (existing) {
                    skipped.push(permissionCode);
                    continue;
                }
                await this.permissionRepository.create({
                    permissionCode,
                    description: description || null,
                }, manager);
                created.push(permissionCode);
            }
            return { created, skipped };
        });
    }
    discoverControllerPermissions() {
        const controllers = this.discoveryService.getControllers();
        const permissions = [];
        const seen = new Set();
        for (const wrapper of controllers) {
            const metatype = wrapper.metatype;
            if (!metatype?.prototype)
                continue;
            if (this.reflector.get(skip_auto_permission_decorator_1.SKIP_AUTO_PERMISSION_KEY, metatype))
                continue;
            const controllerPath = this.getControllerPath(metatype);
            if (!controllerPath)
                continue;
            const methodNames = this.getRouteMethodNames(metatype);
            for (const methodName of methodNames) {
                const permissionCode = `${controllerPath}:${methodName}`;
                if (seen.has(permissionCode))
                    continue;
                seen.add(permissionCode);
                permissions.push({
                    permissionCode,
                    description: `${controllerPath} - ${methodName}`,
                });
            }
        }
        return permissions.sort((a, b) => a.permissionCode.localeCompare(b.permissionCode));
    }
    getControllerPath(controllerClass) {
        const path = Reflect.getMetadata(constants_1.PATH_METADATA, controllerClass) ??
            this.derivePathFromClassName(controllerClass.name);
        if (path == null || path === '')
            return null;
        return String(path).replace(/^\//, '').toLowerCase();
    }
    derivePathFromClassName(className) {
        const withoutController = className.replace(/Controller$/i, '') || className;
        const lower = withoutController.toLowerCase();
        return lower.endsWith('s') ? lower : `${lower}s`;
    }
    getRouteMethodNames(controllerClass) {
        const prototype = controllerClass.prototype;
        if (!prototype)
            return [];
        return Object.getOwnPropertyNames(prototype).filter((methodName) => {
            if (methodName === 'constructor')
                return false;
            const routePath = Reflect.getMetadata(constants_1.PATH_METADATA, prototype[methodName]);
            return routePath !== undefined;
        });
    }
};
exports.PermissionGeneratorService = PermissionGeneratorService;
exports.PermissionGeneratorService = PermissionGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        permission_repository_1.PermissionRepository,
        transaction_service_1.TransactionService])
], PermissionGeneratorService);
//# sourceMappingURL=permission-generator.service.js.map