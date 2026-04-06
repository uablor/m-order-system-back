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
exports.PaymentOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const customer_order_orm_entity_1 = require("../../orders/entities/customer-order.orm-entity");
const user_orm_entity_1 = require("../../users/entities/user.orm-entity");
const image_orm_entity_1 = require("../../images/entities/image.orm-entity");
const payment_enum_1 = require("../enum/payment.enum");
let PaymentOrmEntity = class PaymentOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    customerOrder;
    customerOrderId;
    paymentAmount;
    paymentDate;
    paymentProofImage;
    paymentProofImageId;
    customerMessage;
    status;
    verifiedBy;
    verifiedById;
    verifiedAt;
    rejectedBy;
    rejectedById;
    rejectedAt;
    rejectReason;
    notes;
    readAt;
};
exports.PaymentOrmEntity = PaymentOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_order_orm_entity_1.CustomerOrderOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_order_id' }),
    __metadata("design:type", customer_order_orm_entity_1.CustomerOrderOrmEntity)
], PaymentOrmEntity.prototype, "customerOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_order_id' }),
    __metadata("design:type", Number)
], PaymentOrmEntity.prototype, "customerOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_amount', type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PaymentOrmEntity.prototype, "paymentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PaymentOrmEntity.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => image_orm_entity_1.ImageOrmEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'payment_proof_image_id' }),
    __metadata("design:type", image_orm_entity_1.ImageOrmEntity)
], PaymentOrmEntity.prototype, "paymentProofImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_proof_image_id', nullable: true }),
    __metadata("design:type", Object)
], PaymentOrmEntity.prototype, "paymentProofImageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "customerMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: payment_enum_1.PaymentVerificationStatusEnum, default: payment_enum_1.PaymentVerificationStatusEnum.PENDING }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_orm_entity_1.UserOrmEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'verified_by' }),
    __metadata("design:type", user_orm_entity_1.UserOrmEntity)
], PaymentOrmEntity.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verified_by', nullable: true }),
    __metadata("design:type", Number)
], PaymentOrmEntity.prototype, "verifiedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verified_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PaymentOrmEntity.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_orm_entity_1.UserOrmEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'rejected_by' }),
    __metadata("design:type", user_orm_entity_1.UserOrmEntity)
], PaymentOrmEntity.prototype, "rejectedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejected_by', nullable: true }),
    __metadata("design:type", Number)
], PaymentOrmEntity.prototype, "rejectedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejected_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PaymentOrmEntity.prototype, "rejectedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reject_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "rejectReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'read_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PaymentOrmEntity.prototype, "readAt", void 0);
exports.PaymentOrmEntity = PaymentOrmEntity = __decorate([
    (0, typeorm_1.Entity)('payments')
], PaymentOrmEntity);
//# sourceMappingURL=payment.orm-entity.js.map