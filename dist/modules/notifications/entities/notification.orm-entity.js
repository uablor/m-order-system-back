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
exports.NotificationOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const merchant_orm_entity_1 = require("../../merchants/entities/merchant.orm-entity");
const customer_orm_entity_1 = require("../../customers/entities/customer.orm-entity");
const customer_order_orm_entity_1 = require("../../orders/entities/customer-order.orm-entity");
const notification_enum_1 = require("../enum/notification.enum");
let NotificationOrmEntity = class NotificationOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    merchant;
    uniqueToken;
    customer;
    customerOrder;
    notificationType;
    channel;
    recipientContact;
    messageContent;
    notificationLink;
    retryCount;
    lastRetryAt;
    status;
    sentAt;
    errorMessage;
    relatedOrders;
    language;
};
exports.NotificationOrmEntity = NotificationOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_orm_entity_1.MerchantOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", merchant_orm_entity_1.MerchantOrmEntity)
], NotificationOrmEntity.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unique_token', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], NotificationOrmEntity.prototype, "uniqueToken", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_orm_entity_1.CustomerOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_orm_entity_1.CustomerOrmEntity)
], NotificationOrmEntity.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_order_orm_entity_1.CustomerOrderOrmEntity, (customerOrder) => customerOrder.notification),
    __metadata("design:type", Array)
], NotificationOrmEntity.prototype, "customerOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_type', type: 'enum', enum: notification_enum_1.NotificationType, default: notification_enum_1.NotificationType.ARRIVAL }),
    __metadata("design:type", String)
], NotificationOrmEntity.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: notification_enum_1.NotificationChannel, default: notification_enum_1.NotificationChannel.FB }),
    __metadata("design:type", String)
], NotificationOrmEntity.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_contact', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], NotificationOrmEntity.prototype, "recipientContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'message_content', type: 'text' }),
    __metadata("design:type", String)
], NotificationOrmEntity.prototype, "messageContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_link', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], NotificationOrmEntity.prototype, "notificationLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'retry_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NotificationOrmEntity.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_retry_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], NotificationOrmEntity.prototype, "lastRetryAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: notification_enum_1.NotificationStatus, default: notification_enum_1.NotificationStatus.SENT }),
    __metadata("design:type", String)
], NotificationOrmEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], NotificationOrmEntity.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], NotificationOrmEntity.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_orders', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], NotificationOrmEntity.prototype, "relatedOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'language', type: 'varchar', length: 10, nullable: true, default: 'en' }),
    __metadata("design:type", Object)
], NotificationOrmEntity.prototype, "language", void 0);
exports.NotificationOrmEntity = NotificationOrmEntity = __decorate([
    (0, typeorm_1.Entity)('notifications')
], NotificationOrmEntity);
//# sourceMappingURL=notification.orm-entity.js.map