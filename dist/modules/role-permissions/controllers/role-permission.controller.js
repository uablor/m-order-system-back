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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const role_permission_command_service_1 = require("../services/role-permission-command.service");
const role_permission_query_service_1 = require("../services/role-permission-query.service");
const assign_permission_dto_1 = require("../dto/assign-permission.dto");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let RolePermissionController = class RolePermissionController {
    commandService;
    queryService;
    constructor(commandService, queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }
    async adminAssign(dto) {
        await this.commandService.assign(dto.roleId, dto.permissionId);
        return { success: true };
    }
    async adminUnassign(roleId, permissionId) {
        await this.commandService.unassign(roleId, permissionId);
    }
    async adminGetByRoleId(roleId) {
        return this.queryService.getPermissionsByRoleId(roleId);
    }
};
exports.RolePermissionController = RolePermissionController;
__decorate([
    (0, common_1.Post)('assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign permission to role (ADMIN only)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_permission_dto_1.AssignPermissionDto]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "adminAssign", null);
__decorate([
    (0, common_1.Delete)(':roleId/:permissionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Unassign permission from role' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role ID' }),
    (0, swagger_1.ApiParam)({ name: 'permissionId', description: 'Permission ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('permissionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "adminUnassign", null);
__decorate([
    (0, common_1.Get)('role/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'List permissions by role ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolePermissionController.prototype, "adminGetByRoleId", null);
exports.RolePermissionController = RolePermissionController = __decorate([
    (0, swagger_1.ApiTags)('Role Permissions'),
    (0, common_1.Controller)('role-permissions'),
    __metadata("design:paramtypes", [role_permission_command_service_1.RolePermissionCommandService,
        role_permission_query_service_1.RolePermissionQueryService])
], RolePermissionController);
//# sourceMappingURL=role-permission.controller.js.map