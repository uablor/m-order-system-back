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
exports.RolePermissionCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const role_permission_repository_1 = require("../repositories/role-permission.repository");
const role_repository_1 = require("../../roles/repositories/role.repository");
const permission_repository_1 = require("../../permissions/repositories/permission.repository");
let RolePermissionCommandService = class RolePermissionCommandService {
    rolePermissionRepository;
    roleRepository;
    permissionRepository;
    transactionService;
    constructor(rolePermissionRepository, roleRepository, permissionRepository, transactionService) {
        this.rolePermissionRepository = rolePermissionRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.transactionService = transactionService;
    }
    async assign(roleId, permissionId) {
        await this.transactionService.run(async (manager) => {
            const role = await this.roleRepository.findOneById(roleId, manager);
            if (!role)
                throw new common_1.NotFoundException('Role not found');
            const permission = await this.permissionRepository.findOneById(permissionId, manager);
            if (!permission)
                throw new common_1.NotFoundException('Permission not found');
            const exists = await this.rolePermissionRepository.exists(roleId, permissionId, manager);
            if (exists)
                throw new common_1.ConflictException('Permission already assigned to role');
            await this.rolePermissionRepository.add(roleId, permissionId, manager);
        });
    }
    async unassign(roleId, permissionId) {
        await this.transactionService.run(async (manager) => {
            const removed = await this.rolePermissionRepository.remove(roleId, permissionId, manager);
            if (!removed) {
                throw new common_1.NotFoundException('Role permission assignment not found');
            }
        });
    }
};
exports.RolePermissionCommandService = RolePermissionCommandService;
exports.RolePermissionCommandService = RolePermissionCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_permission_repository_1.RolePermissionRepository,
        role_repository_1.RoleRepository,
        permission_repository_1.PermissionRepository,
        transaction_service_1.TransactionService])
], RolePermissionCommandService);
//# sourceMappingURL=role-permission-command.service.js.map