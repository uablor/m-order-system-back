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
exports.RolePermissionOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const permission_orm_entity_1 = require("../../permissions/entities/permission.orm-entity");
const role_orm_entity_1 = require("../../roles/entities/role.orm-entity");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
let RolePermissionOrmEntity = class RolePermissionOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    roleId;
    permissionId;
    role;
    permission;
};
exports.RolePermissionOrmEntity = RolePermissionOrmEntity;
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', type: 'number' }),
    __metadata("design:type", Number)
], RolePermissionOrmEntity.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permission_id', type: 'number' }),
    __metadata("design:type", Number)
], RolePermissionOrmEntity.prototype, "permissionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_orm_entity_1.RoleOrmEntity, (role) => role.rolePermissions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_orm_entity_1.RoleOrmEntity)
], RolePermissionOrmEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_orm_entity_1.PermissionOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'permission_id' }),
    __metadata("design:type", permission_orm_entity_1.PermissionOrmEntity)
], RolePermissionOrmEntity.prototype, "permission", void 0);
exports.RolePermissionOrmEntity = RolePermissionOrmEntity = __decorate([
    (0, typeorm_1.Entity)('role_permissions')
], RolePermissionOrmEntity);
//# sourceMappingURL=role-permission.orm-entity.js.map