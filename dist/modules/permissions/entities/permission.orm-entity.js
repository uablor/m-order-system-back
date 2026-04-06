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
exports.PermissionOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
let PermissionOrmEntity = class PermissionOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    permissionCode;
    description;
};
exports.PermissionOrmEntity = PermissionOrmEntity;
__decorate([
    (0, typeorm_1.Column)({ name: 'permission_code', unique: true }),
    __metadata("design:type", String)
], PermissionOrmEntity.prototype, "permissionCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], PermissionOrmEntity.prototype, "description", void 0);
exports.PermissionOrmEntity = PermissionOrmEntity = __decorate([
    (0, typeorm_1.Entity)('permissions')
], PermissionOrmEntity);
//# sourceMappingURL=permission.orm-entity.js.map