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
exports.AuthQueryService = void 0;
const common_1 = require("@nestjs/common");
const user_query_repository_1 = require("../../users/repositories/user.query-repository");
const role_permission_query_service_1 = require("../../role-permissions/services/role-permission-query.service");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let AuthQueryService = class AuthQueryService {
    userQueryRepository;
    rolePermissionQueryService;
    constructor(userQueryRepository, rolePermissionQueryService) {
        this.userQueryRepository = userQueryRepository;
        this.rolePermissionQueryService = rolePermissionQueryService;
    }
    async getProfile(userId) {
        const entity = await this.userQueryRepository.repository.findOne({
            where: { id: userId },
            relations: ['role', 'merchant'],
        });
        if (!entity)
            throw new common_1.NotFoundException('User not found');
        if (!entity.isActive)
            throw new common_1.NotFoundException('User not found');
        const merchantId = entity.merchantId ?? entity.merchant?.id ?? null;
        const permResp = await this.rolePermissionQueryService.getPermissionsByRoleId(entity.roleId);
        const permissionCodes = permResp.results?.map((p) => p.permissionCode) ?? [];
        const profile = {
            userId: entity.id,
            email: entity.email,
            fullName: entity.fullName,
            roleId: entity.roleId,
            roleName: entity.role?.roleName,
            merchantId: merchantId ?? undefined,
            permissions: permissionCodes,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            lastLogin: entity.lastLogin,
        };
        return (0, response_helper_1.createSingleResponse)(profile);
    }
};
exports.AuthQueryService = AuthQueryService;
exports.AuthQueryService = AuthQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_query_repository_1.UserQueryRepository,
        role_permission_query_service_1.RolePermissionQueryService])
], AuthQueryService);
//# sourceMappingURL=auth-query.service.js.map