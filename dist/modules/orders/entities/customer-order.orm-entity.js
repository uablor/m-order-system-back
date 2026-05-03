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
exports.CustomerOrderOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const order_orm_entity_1 = require("./order.orm-entity");
const customer_orm_entity_1 = require("../../customers/entities/customer.orm-entity");
const customer_order_item_orm_entity_1 = require("./customer-order-item.orm-entity");
const notification_orm_entity_1 = require("../../notifications/entities/notification.orm-entity");
const payment_enum_1 = require("../../payments/enum/payment.enum");
let CustomerOrderOrmEntity = class CustomerOrderOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    order;
    customer;
    totalSellingAmount;
    totalPaid;
    remainingAmount;
    paymentStatus;
    discountType;
    discountValue;
    discountAmount;
    customerOrderItems;
    notification;
};
exports.CustomerOrderOrmEntity = CustomerOrderOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_orm_entity_1.OrderOrmEntity, (o) => o.customerOrders, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_orm_entity_1.OrderOrmEntity)
], CustomerOrderOrmEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_orm_entity_1.CustomerOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_orm_entity_1.CustomerOrmEntity)
], CustomerOrderOrmEntity.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_selling_amount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderOrmEntity.prototype, "totalSellingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_paid', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderOrmEntity.prototype, "totalPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remaining_amount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderOrmEntity.prototype, "remainingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'enum', enum: payment_enum_1.PaymentStatusEnum, default: payment_enum_1.PaymentStatusEnum.NOT_CREATED }),
    __metadata("design:type", String)
], CustomerOrderOrmEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_type', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrderOrmEntity.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_value', type: 'decimal', precision: 18, scale: 4, nullable: true }),
    __metadata("design:type", Object)
], CustomerOrderOrmEntity.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerOrderOrmEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_order_item_orm_entity_1.CustomerOrderItemOrmEntity, (coi) => coi.customerOrder),
    __metadata("design:type", Array)
], CustomerOrderOrmEntity.prototype, "customerOrderItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => notification_orm_entity_1.NotificationOrmEntity, (notification) => notification.customerOrder, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_id' }),
    __metadata("design:type", notification_orm_entity_1.NotificationOrmEntity)
], CustomerOrderOrmEntity.prototype, "notification", void 0);
exports.CustomerOrderOrmEntity = CustomerOrderOrmEntity = __decorate([
    (0, typeorm_1.Entity)('customer_orders')
], CustomerOrderOrmEntity);
//# sourceMappingURL=customer-order.orm-entity.js.map