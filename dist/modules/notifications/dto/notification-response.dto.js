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
exports.NotificationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const customer_response_dto_1 = require("../../customers/dto/customer-response.dto");
const merchant_response_dto_1 = require("../../merchants/dto/merchant-response.dto");
class NotificationResponseDto {
    id;
    merchant;
    customer;
    notificationType;
    channel;
    recipientContact;
    messageContent;
    notificationLink;
    retryCount;
    lastRetryAt;
    status;
    statusSent;
    sentAt;
    errorMessage;
    relatedOrders;
    createdAt;
    updatedAt;
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", merchant_response_dto_1.MerchantResponseDto)
], NotificationResponseDto.prototype, "merchant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", customer_response_dto_1.CustomerResponseDto)
], NotificationResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['ARRIVAL', 'PAYMENT', 'REMINDER'] }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "notificationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['FB', 'LINE', 'WHATSAPP'] }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "recipientContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "messageContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "notificationLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "retryCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "lastRetryAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['SENT', 'FAILED'] }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['PENDING', 'SENT', 'CANCELLED'] }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "statusSent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "errorMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "relatedOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=notification-response.dto.js.map