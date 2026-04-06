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
exports.OrderItemSkuOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const order_item_orm_entity_1 = require("./order-item.orm-entity");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const exchange_rate_orm_entity_1 = require("../../exchange-rates/entities/exchange-rate.orm-entity");
const customer_order_item_orm_entity_1 = require("./customer-order-item.orm-entity");
let OrderItemSkuOrmEntity = class OrderItemSkuOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    orderItemSkuIndex;
    customerOrderItems;
    orderItem;
    exchangeRateBuy;
    exchangeRateSell;
    variant;
    quantity;
    exchangeRateBuyValue;
    exchangeRateSellValue;
    purchasePrice;
    purchaseTotal;
    sellingPriceForeign;
    sellingTotal;
    profit;
};
exports.OrderItemSkuOrmEntity = OrderItemSkuOrmEntity;
__decorate([
    (0, typeorm_1.Column)({ name: 'order_item_sku_index', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuOrmEntity.prototype, "orderItemSkuIndex", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_order_item_orm_entity_1.CustomerOrderItemOrmEntity, (coi) => coi.orderItemSku),
    __metadata("design:type", Array)
], OrderItemSkuOrmEntity.prototype, "customerOrderItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_orm_entity_1.OrderItemOrmEntity, (item) => item.skus, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_item_id' }),
    __metadata("design:type", order_item_orm_entity_1.OrderItemOrmEntity)
], OrderItemSkuOrmEntity.prototype, "orderItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exchange_rate_orm_entity_1.ExchangeRateOrmEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'exchange_rate_buy_id' }),
    __metadata("design:type", Object)
], OrderItemSkuOrmEntity.prototype, "exchangeRateBuy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exchange_rate_orm_entity_1.ExchangeRateOrmEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'exchange_rate_sell_id' }),
    __metadata("design:type", Object)
], OrderItemSkuOrmEntity.prototype, "exchangeRateSell", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuOrmEntity.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], OrderItemSkuOrmEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exchange_rate_buy_value', type: 'decimal', precision: 18, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuOrmEntity.prototype, "exchangeRateBuyValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exchange_rate_sell_value', type: 'decimal', precision: 18, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuOrmEntity.prototype, "exchangeRateSellValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_price', type: 'decimal', precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], OrderItemSkuOrmEntity.prototype, "purchasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemSkuOrmEntity.prototype, "purchaseTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selling_price_foreign', type: 'decimal', precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], OrderItemSkuOrmEntity.prototype, "sellingPriceForeign", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemSkuOrmEntity.prototype, "sellingTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemSkuOrmEntity.prototype, "profit", void 0);
exports.OrderItemSkuOrmEntity = OrderItemSkuOrmEntity = __decorate([
    (0, typeorm_1.Entity)('order_item_skus')
], OrderItemSkuOrmEntity);
//# sourceMappingURL=order-item-sku.orm-entity.js.map