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
exports.CustomerOrderListQueryDto = exports.TokenQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const base_query_dto_1 = require("../../../common/base/dtos/base.query.dto");
class TokenQueryDto {
    customerToken;
    notificationToken;
}
exports.TokenQueryDto = TokenQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer unique token' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TokenQueryDto.prototype, "customerToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by notification token' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TokenQueryDto.prototype, "notificationToken", void 0);
class CustomerOrderListQueryDto extends (0, swagger_1.IntersectionType)(base_query_dto_1.BaseQueryDto, TokenQueryDto) {
    notificationStatus;
    merchantId;
    orderId;
    orderCode;
    customerOrderId;
    customerId;
    customerName;
    isArrived;
    startDate;
    endDate;
    paymentStatus;
}
exports.CustomerOrderListQueryDto = CustomerOrderListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by notification status (null = no notification created)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerOrderListQueryDto.prototype, "notificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CustomerOrderListQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by order ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CustomerOrderListQueryDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by order code (partial match)', example: 'ORD-001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerOrderListQueryDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer order ID (the # shown to customer)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CustomerOrderListQueryDto.prototype, "customerOrderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CustomerOrderListQueryDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer name (partial match)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerOrderListQueryDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by arrival status (true = arrived, false = not arrived)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerOrderListQueryDto.prototype, "isArrived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerOrderListQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerOrderListQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by payment status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerOrderListQueryDto.prototype, "paymentStatus", void 0);
//# sourceMappingURL=customer-order-list-query.dto.js.map