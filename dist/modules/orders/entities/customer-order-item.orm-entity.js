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
exports.CustomerOrderItemOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const customer_order_orm_entity_1 = require("./customer-order.orm-entity");
const order_item_sku_orm_entity_1 = require("./order-item-sku.orm-entity");
const order_item_orm_entity_1 = require("./order-item.orm-entity");
let CustomerOrderItemOrmEntity = class CustomerOrderItemOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    customerOrder;
    orderItemSku;
    orderItem;
    quantity;
    sellingPriceForeign;
    purchasePrice;
    purchaseTotal;
    sellingTotal;
    profit;
};
exports.CustomerOrderItemOrmEntity = CustomerOrderItemOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_order_orm_entity_1.CustomerOrderOrmEntity, (co) => co.customerOrderItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_order_id' }),
    __metadata("design:type", customer_order_orm_entity_1.CustomerOrderOrmEntity)
], CustomerOrderItemOrmEntity.prototype, "customerOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_sku_orm_entity_1.OrderItemSkuOrmEntity, (oi) => oi.customerOrderItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_item_sku_id' }),
    __metadata("design:type", order_item_sku_orm_entity_1.OrderItemSkuOrmEntity)
], CustomerOrderItemOrmEntity.prototype, "orderItemSku", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_orm_entity_1.OrderItemOrmEntity, (oi) => oi.customerOrderItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_item_id' }),
    __metadata("design:type", order_item_orm_entity_1.OrderItemOrmEntity)
], CustomerOrderItemOrmEntity.prototype, "orderItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderItemOrmEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selling_price_foreign', type: 'decimal', precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderItemOrmEntity.prototype, "sellingPriceForeign", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_price', type: 'decimal', precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderItemOrmEntity.prototype, "purchasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderItemOrmEntity.prototype, "purchaseTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderItemOrmEntity.prototype, "sellingTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderItemOrmEntity.prototype, "profit", void 0);
exports.CustomerOrderItemOrmEntity = CustomerOrderItemOrmEntity = __decorate([
    (0, typeorm_1.Entity)('customer_order_items')
], CustomerOrderItemOrmEntity);
//# sourceMappingURL=customer-order-item.orm-entity.js.map