"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_orm_entity_1 = require("./entities/role.orm-entity");
const role_repository_1 = require("./repositories/role.repository");
const role_query_repository_1 = require("./repositories/role.query-repository");
const role_command_service_1 = require("./services/role-command.service");
const role_query_service_1 = require("./services/role-query.service");
const role_controller_1 = require("./controllers/role.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const roles_guard_1 = require("../../common/policies/roles.guard");
let RoleModule = class RoleModule {
};
exports.RoleModule = RoleModule;
exports.RoleModule = RoleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([role_orm_entity_1.RoleOrmEntity])],
        controllers: [role_controller_1.RoleController],
        providers: [
            role_repository_1.RoleRepository,
            role_query_repository_1.RoleQueryRepository,
            role_command_service_1.RoleCommandService,
            role_query_service_1.RoleQueryService,
            transaction_service_1.TransactionService,
            roles_guard_1.RolesGuard,
        ],
        exports: [role_repository_1.RoleRepository, role_query_repository_1.RoleQueryRepository, role_command_service_1.RoleCommandService, role_query_service_1.RoleQueryService],
    })
], RoleModule);
//# sourceMappingURL=role.module.js.map