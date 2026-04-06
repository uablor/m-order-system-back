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
exports.AuthCommandService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const password_util_1 = require("../../../common/utils/password.util");
const user_query_repository_1 = require("../../users/repositories/user.query-repository");
const role_permission_query_service_1 = require("../../role-permissions/services/role-permission-query.service");
let AuthCommandService = class AuthCommandService {
    userQueryRepository;
    rolePermissionQueryService;
    jwtService;
    constructor(userQueryRepository, rolePermissionQueryService, jwtService) {
        this.userQueryRepository = userQueryRepository;
        this.rolePermissionQueryService = rolePermissionQueryService;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const entity = await this.userQueryRepository.repository.findOne({
            where: { email: dto.email },
            relations: ['role', 'merchant'],
        });
        if (!entity) {
            throw new common_1.UnauthorizedException('Email not found');
        }
        if (!entity.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const match = await (0, password_util_1.comparePassword)(dto.password, entity.passwordHash);
        if (!match) {
            throw new common_1.UnauthorizedException('Incorrect password');
        }
        entity.lastLogin = new Date();
        await this.userQueryRepository.repository.save(entity);
        const merchantId = entity.merchantId ?? entity.merchant?.id ?? null;
        const permResp = await this.rolePermissionQueryService.getPermissionsByRoleId(entity.roleId);
        const permissionCodes = permResp.results?.map((p) => p.permissionCode) ?? [];
        const payload = {
            userId: entity.id,
            email: entity.email,
            roleId: entity.roleId,
            roleName: entity.role?.roleName,
            merchantId: merchantId ?? undefined,
            permissions: permissionCodes,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            success: true,
            message: 'Login successful',
            access_token,
            user: {
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
            },
        };
    }
};
exports.AuthCommandService = AuthCommandService;
exports.AuthCommandService = AuthCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_query_repository_1.UserQueryRepository,
        role_permission_query_service_1.RolePermissionQueryService,
        jwt_1.JwtService])
], AuthCommandService);
//# sourceMappingURL=auth-command.service.js.map