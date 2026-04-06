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
exports.MerchantOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const user_orm_entity_1 = require("../../users/entities/user.orm-entity");
const image_orm_entity_1 = require("../../images/entities/image.orm-entity");
let MerchantOrmEntity = class MerchantOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    ownerUserId;
    ownerUser;
    shopName;
    shopLogoUrlId;
    shopLogoUrl;
    shopAddress;
    contactPhone;
    contactEmail;
    contactFacebook;
    contactLine;
    contactWhatsapp;
    defaultCurrency;
    isActive;
};
exports.MerchantOrmEntity = MerchantOrmEntity;
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_user_id', type: 'int' }),
    __metadata("design:type", Number)
], MerchantOrmEntity.prototype, "ownerUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_orm_entity_1.UserOrmEntity, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_user_id' }),
    __metadata("design:type", user_orm_entity_1.UserOrmEntity)
], MerchantOrmEntity.prototype, "ownerUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shop_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], MerchantOrmEntity.prototype, "shopName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shop_logo_url_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MerchantOrmEntity.prototype, "shopLogoUrlId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => image_orm_entity_1.ImageOrmEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'shop_logo_url_id' }),
    __metadata("design:type", image_orm_entity_1.ImageOrmEntity)
], MerchantOrmEntity.prototype, "shopLogoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shop_address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], MerchantOrmEntity.prototype, "shopAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], MerchantOrmEntity.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], MerchantOrmEntity.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_facebook', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], MerchantOrmEntity.prototype, "contactFacebook", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_line', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], MerchantOrmEntity.prototype, "contactLine", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_whatsapp', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], MerchantOrmEntity.prototype, "contactWhatsapp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_currency', type: 'varchar', length: 10, default: 'THB' }),
    __metadata("design:type", String)
], MerchantOrmEntity.prototype, "defaultCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], MerchantOrmEntity.prototype, "isActive", void 0);
exports.MerchantOrmEntity = MerchantOrmEntity = __decorate([
    (0, typeorm_1.Entity)('merchants')
], MerchantOrmEntity);
//# sourceMappingURL=merchant.orm-entity.js.map