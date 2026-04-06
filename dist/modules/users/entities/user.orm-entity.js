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
exports.UserOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const role_orm_entity_1 = require("../../roles/entities/role.orm-entity");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const merchant_orm_entity_1 = require("../../merchants/entities/merchant.orm-entity");
let UserOrmEntity = class UserOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    email;
    passwordHash;
    fullName;
    roleId;
    role;
    merchantId;
    merchant;
    isActive;
    lastLogin;
};
exports.UserOrmEntity = UserOrmEntity;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash' }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name' }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', type: 'number' }),
    __metadata("design:type", Number)
], UserOrmEntity.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_orm_entity_1.RoleOrmEntity, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_orm_entity_1.RoleOrmEntity)
], UserOrmEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'merchant_id', type: 'number', nullable: true }),
    __metadata("design:type", Object)
], UserOrmEntity.prototype, "merchantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_orm_entity_1.MerchantOrmEntity, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", Object)
], UserOrmEntity.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], UserOrmEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], UserOrmEntity.prototype, "lastLogin", void 0);
exports.UserOrmEntity = UserOrmEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserOrmEntity);
//# sourceMappingURL=user.orm-entity.js.map