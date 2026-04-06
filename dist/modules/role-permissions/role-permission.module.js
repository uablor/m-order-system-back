"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_permission_orm_entity_1 = require("./entities/role-permission.orm-entity");
const role_permission_repository_1 = require("./repositories/role-permission.repository");
const role_permission_query_repository_1 = require("./repositories/role-permission.query-repository");
const role_permission_command_service_1 = require("./services/role-permission-command.service");
const role_permission_query_service_1 = require("./services/role-permission-query.service");
const role_permission_controller_1 = require("./controllers/role-permission.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const role_module_1 = require("../roles/role.module");
const permission_module_1 = require("../permissions/permission.module");
const roles_guard_1 = require("../../common/policies/roles.guard");
let RolePermissionModule = class RolePermissionModule {
};
exports.RolePermissionModule = RolePermissionModule;
exports.RolePermissionModule = RolePermissionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([role_permission_orm_entity_1.RolePermissionOrmEntity]),
            role_module_1.RoleModule,
            permission_module_1.PermissionModule,
        ],
        controllers: [role_permission_controller_1.RolePermissionController],
        providers: [
            role_permission_repository_1.RolePermissionRepository,
            role_permission_query_repository_1.RolePermissionQueryRepository,
            role_permission_command_service_1.RolePermissionCommandService,
            role_permission_query_service_1.RolePermissionQueryService,
            transaction_service_1.TransactionService,
            roles_guard_1.RolesGuard,
        ],
        exports: [role_permission_repository_1.RolePermissionRepository, role_permission_command_service_1.RolePermissionCommandService, role_permission_query_service_1.RolePermissionQueryService],
    })
], RolePermissionModule);
//# sourceMappingURL=role-permission.module.js.map