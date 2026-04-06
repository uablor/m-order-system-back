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
exports.OrderOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const merchant_orm_entity_1 = require("../../merchants/entities/merchant.orm-entity");
const user_orm_entity_1 = require("../../users/entities/user.orm-entity");
const order_item_orm_entity_1 = require("./order-item.orm-entity");
const customer_order_orm_entity_1 = require("./customer-order.orm-entity");
const enum_entities_1 = require("../enum/enum.entities");
const exchange_rate_orm_entity_1 = require("../../exchange-rates/entities/exchange-rate.orm-entity");
const payment_enum_1 = require("../../payments/enum/payment.enum");
let OrderOrmEntity = class OrderOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    merchant;
    createdByUser;
    orderCode;
    orderDate;
    arrivalStatus;
    arrivedAt;
    notifiedAt;
    exchangeRateBuy;
    exchangeRateSell;
    exchangeRateBuyValue;
    exchangeRateSellValue;
    totalPurchaseCost;
    totalShippingCost;
    totalCostBeforeDiscount;
    totalDiscount;
    totalFinalCost;
    totalSellingAmount;
    totalProfit;
    paymentStatus;
    orderItems;
    customerOrders;
};
exports.OrderOrmEntity = OrderOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_orm_entity_1.MerchantOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", merchant_orm_entity_1.MerchantOrmEntity)
], OrderOrmEntity.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_orm_entity_1.UserOrmEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", Object)
], OrderOrmEntity.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_code', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], OrderOrmEntity.prototype, "orderCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_date', type: 'date' }),
    __metadata("design:type", Date)
], OrderOrmEntity.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arrival_status', type: 'enum', enum: enum_entities_1.ArrivalStatusEnum, default: enum_entities_1.ArrivalStatusEnum.NOT_ARRIVED }),
    __metadata("design:type", String)
], OrderOrmEntity.prototype, "arrivalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arrived_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], OrderOrmEntity.prototype, "arrivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notified_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], OrderOrmEntity.prototype, "notifiedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exchange_rate_orm_entity_1.ExchangeRateOrmEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'exchange_rate_buy_id' }),
    __metadata("design:type", Object)
], OrderOrmEntity.prototype, "exchangeRateBuy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exchange_rate_orm_entity_1.ExchangeRateOrmEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'exchange_rate_sell_id' }),
    __metadata("design:type", Object)
], OrderOrmEntity.prototype, "exchangeRateSell", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exchange_rate_buy', type: 'decimal', precision: 18, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], OrderOrmEntity.prototype, "exchangeRateBuyValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exchange_rate_sell', type: 'decimal', precision: 18, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], OrderOrmEntity.prototype, "exchangeRateSellValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_purchase_cost', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderOrmEntity.prototype, "totalPurchaseCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_shipping_cost', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderOrmEntity.prototype, "totalShippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_cost_before_discount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderOrmEntity.prototype, "totalCostBeforeDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_discount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderOrmEntity.prototype, "totalDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_final_cost', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderOrmEntity.prototype, "totalFinalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_selling_amount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderOrmEntity.prototype, "totalSellingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_profit', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderOrmEntity.prototype, "totalProfit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'enum', enum: payment_enum_1.PaymentStatusEnum, default: payment_enum_1.PaymentStatusEnum.NOT_CREATED }),
    __metadata("design:type", String)
], OrderOrmEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_orm_entity_1.OrderItemOrmEntity, (item) => item.order),
    __metadata("design:type", Array)
], OrderOrmEntity.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_order_orm_entity_1.CustomerOrderOrmEntity, (co) => co.order),
    __metadata("design:type", Array)
], OrderOrmEntity.prototype, "customerOrders", void 0);
exports.OrderOrmEntity = OrderOrmEntity = __decorate([
    (0, typeorm_1.Entity)('orders')
], OrderOrmEntity);
//# sourceMappingURL=order.orm-entity.js.map