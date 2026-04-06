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
exports.PaymentListQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_query_dto_1 = require("../../../common/base/dtos/base.query.dto");
class PaymentListQueryDto extends base_query_dto_1.BaseQueryDto {
    status;
    customerOrderId;
    customerId;
    merchantId;
    paymentDateFrom;
    paymentDateTo;
    readAt;
}
exports.PaymentListQueryDto = PaymentListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by payment status (PENDING/VERIFIED/REJECTED)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer order ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentListQueryDto.prototype, "customerOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentListQueryDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentListQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by payment date range (start)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PaymentListQueryDto.prototype, "paymentDateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by payment date range (end)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PaymentListQueryDto.prototype, "paymentDateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by read status (null for unread)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PaymentListQueryDto.prototype, "readAt", void 0);
//# sourceMappingURL=payment-list-query.dto.js.map