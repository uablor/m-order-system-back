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
exports.ExchangeRateOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const merchant_orm_entity_1 = require("../../merchants/entities/merchant.orm-entity");
const user_orm_entity_1 = require("../../users/entities/user.orm-entity");
let ExchangeRateOrmEntity = class ExchangeRateOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    merchant;
    baseCurrency;
    targetCurrency;
    rateType;
    rate;
    isActive;
    rateDate;
    createdByUser;
};
exports.ExchangeRateOrmEntity = ExchangeRateOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_orm_entity_1.MerchantOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", merchant_orm_entity_1.MerchantOrmEntity)
], ExchangeRateOrmEntity.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'base_currency', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], ExchangeRateOrmEntity.prototype, "baseCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_currency', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], ExchangeRateOrmEntity.prototype, "targetCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_type', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], ExchangeRateOrmEntity.prototype, "rateType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 6, default: 0 }),
    __metadata("design:type", Number)
], ExchangeRateOrmEntity.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ExchangeRateOrmEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_date', type: 'date' }),
    __metadata("design:type", Date)
], ExchangeRateOrmEntity.prototype, "rateDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_orm_entity_1.UserOrmEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", Object)
], ExchangeRateOrmEntity.prototype, "createdByUser", void 0);
exports.ExchangeRateOrmEntity = ExchangeRateOrmEntity = __decorate([
    (0, typeorm_1.Entity)('exchange_rates')
], ExchangeRateOrmEntity);
//# sourceMappingURL=exchange-rate.orm-entity.js.map