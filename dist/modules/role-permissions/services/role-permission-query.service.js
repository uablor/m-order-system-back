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
exports.RolePermissionQueryService = void 0;
const common_1 = require("@nestjs/common");
const role_permission_query_repository_1 = require("../repositories/role-permission.query-repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let RolePermissionQueryService = class RolePermissionQueryService {
    rolePermissionQueryRepository;
    constructor(rolePermissionQueryRepository) {
        this.rolePermissionQueryRepository = rolePermissionQueryRepository;
    }
    async getPermissionsByRoleId(roleId) {
        const permissions = await this.rolePermissionQueryRepository.findPermissionsByRoleId(roleId);
        const results = permissions.map((p) => ({
            id: p.id,
            permissionCode: p.permissionCode,
            description: p.description,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
        return (0, response_helper_1.createResponse)(results);
    }
};
exports.RolePermissionQueryService = RolePermissionQueryService;
exports.RolePermissionQueryService = RolePermissionQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_permission_query_repository_1.RolePermissionQueryRepository])
], RolePermissionQueryService);
//# sourceMappingURL=role-permission-query.service.js.map