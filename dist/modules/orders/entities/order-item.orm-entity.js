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
exports.OrderItemOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const order_orm_entity_1 = require("./order.orm-entity");
const image_orm_entity_1 = require("../../images/entities/image.orm-entity");
const order_item_sku_orm_entity_1 = require("./order-item-sku.orm-entity");
const customer_order_item_orm_entity_1 = require("./customer-order-item.orm-entity");
const exchange_rate_orm_entity_1 = require("../../exchange-rates/entities/exchange-rate.orm-entity");
let OrderItemOrmEntity = class OrderItemOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    order;
    customerOrderItems;
    image;
    imageId;
    skus;
    productName;
    discountType;
    discountValue;
    quantity;
    purchaseTotal;
    shippingExchangeRate;
    shippingExchangeRateValue;
    shippingTotal;
    totalCostBeforeDiscount;
    discountAmount;
    finalCost;
    sellingTotal;
    profit;
};
exports.OrderItemOrmEntity = OrderItemOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_orm_entity_1.OrderOrmEntity, (o) => o.orderItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_orm_entity_1.OrderOrmEntity)
], OrderItemOrmEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_order_item_orm_entity_1.CustomerOrderItemOrmEntity, (coi) => coi.orderItemSku),
    __metadata("design:type", Array)
], OrderItemOrmEntity.prototype, "customerOrderItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => image_orm_entity_1.ImageOrmEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'image_id' }),
    __metadata("design:type", Object)
], OrderItemOrmEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], OrderItemOrmEntity.prototype, "imageId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_sku_orm_entity_1.OrderItemSkuOrmEntity, (sku) => sku.orderItem, { cascade: true }),
    __metadata("design:type", Array)
], OrderItemOrmEntity.prototype, "skus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OrderItemOrmEntity.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_type', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], OrderItemOrmEntity.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_value', type: 'decimal', precision: 18, scale: 4, nullable: true }),
    __metadata("design:type", Object)
], OrderItemOrmEntity.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "purchaseTotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exchange_rate_orm_entity_1.ExchangeRateOrmEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'shipping_exchange_rate_id' }),
    __metadata("design:type", Object)
], OrderItemOrmEntity.prototype, "shippingExchangeRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_exchange_rate_value', type: 'decimal', precision: 18, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], OrderItemOrmEntity.prototype, "shippingExchangeRateValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_total', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "shippingTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_cost_before_discount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "totalCostBeforeDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'final_cost', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "finalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "sellingTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderItemOrmEntity.prototype, "profit", void 0);
exports.OrderItemOrmEntity = OrderItemOrmEntity = __decorate([
    (0, typeorm_1.Entity)('order_items')
], OrderItemOrmEntity);
//# sourceMappingURL=order-item.orm-entity.js.map