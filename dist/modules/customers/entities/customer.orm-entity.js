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
exports.CustomerOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const merchant_orm_entity_1 = require("../../merchants/entities/merchant.orm-entity");
let CustomerOrmEntity = class CustomerOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    merchant;
    customerName;
    customerType;
    shippingAddress;
    shippingProvider;
    shippingSource;
    shippingDestination;
    paymentTerms;
    contactPhone;
    contactFacebook;
    contactWhatsapp;
    contactLine;
    preferredContactMethod;
    uniqueToken;
    isActive;
};
exports.CustomerOrmEntity = CustomerOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_orm_entity_1.MerchantOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", merchant_orm_entity_1.MerchantOrmEntity)
], CustomerOrmEntity.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CustomerOrmEntity.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CustomerOrmEntity.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_provider', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "shippingProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_source', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "shippingSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_destination', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "shippingDestination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "paymentTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_facebook', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "contactFacebook", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_whatsapp', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "contactWhatsapp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_line', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "contactLine", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'preferred_contact_method', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrmEntity.prototype, "preferredContactMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unique_token', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], CustomerOrmEntity.prototype, "uniqueToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CustomerOrmEntity.prototype, "isActive", void 0);
exports.CustomerOrmEntity = CustomerOrmEntity = __decorate([
    (0, typeorm_1.Entity)('customers')
], CustomerOrmEntity);
//# sourceMappingURL=customer.orm-entity.js.map