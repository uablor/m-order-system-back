"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const permission_orm_entity_1 = require("./entities/permission.orm-entity");
const permission_repository_1 = require("./repositories/permission.repository");
const permission_query_repository_1 = require("./repositories/permission.query-repository");
const permission_command_service_1 = require("./services/permission-command.service");
const permission_query_service_1 = require("./services/permission-query.service");
const permission_generator_service_1 = require("./services/permission-generator.service");
const permission_controller_1 = require("./controllers/permission.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const roles_guard_1 = require("../../common/policies/roles.guard");
let PermissionModule = class PermissionModule {
};
exports.PermissionModule = PermissionModule;
exports.PermissionModule = PermissionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([permission_orm_entity_1.PermissionOrmEntity]),
            core_1.DiscoveryModule,
        ],
        controllers: [permission_controller_1.PermissionController],
        providers: [
            permission_repository_1.PermissionRepository,
            permission_query_repository_1.PermissionQueryRepository,
            permission_command_service_1.PermissionCommandService,
            permission_query_service_1.PermissionQueryService,
            permission_generator_service_1.PermissionGeneratorService,
            transaction_service_1.TransactionService,
            roles_guard_1.RolesGuard,
        ],
        exports: [
            permission_repository_1.PermissionRepository,
            permission_query_repository_1.PermissionQueryRepository,
            permission_command_service_1.PermissionCommandService,
            permission_query_service_1.PermissionQueryService,
            permission_generator_service_1.PermissionGeneratorService,
        ],
    })
], PermissionModule);
//# sourceMappingURL=permission.module.js.map