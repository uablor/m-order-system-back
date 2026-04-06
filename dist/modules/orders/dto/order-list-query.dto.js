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
exports.OrderListQueryDto = exports.PaymentStatusFilter = exports.ArrivalStatusFilter = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const base_query_dto_1 = require("../../../common/base/dtos/base.query.dto");
var ArrivalStatusFilter;
(function (ArrivalStatusFilter) {
    ArrivalStatusFilter["NOT_ARRIVED"] = "NOT_ARRIVED";
    ArrivalStatusFilter["ARRIVED"] = "ARRIVED";
})(ArrivalStatusFilter || (exports.ArrivalStatusFilter = ArrivalStatusFilter = {}));
var PaymentStatusFilter;
(function (PaymentStatusFilter) {
    PaymentStatusFilter["UNPAID"] = "UNPAID";
    PaymentStatusFilter["PARTIAL"] = "PARTIAL";
    PaymentStatusFilter["PAID"] = "PAID";
})(PaymentStatusFilter || (exports.PaymentStatusFilter = PaymentStatusFilter = {}));
class OrderListQueryDto extends base_query_dto_1.BaseQueryDto {
    merchantId;
    customerId;
    customerName;
    startDate;
    endDate;
    arrivalStatus;
    paymentStatus;
}
exports.OrderListQueryDto = OrderListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrderListQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrderListQueryDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer name (partial match)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderListQueryDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrderListQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrderListQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ArrivalStatusFilter, description: 'Filter by arrival status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ArrivalStatusFilter),
    __metadata("design:type", String)
], OrderListQueryDto.prototype, "arrivalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PaymentStatusFilter, description: 'Filter by payment status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PaymentStatusFilter),
    __metadata("design:type", String)
], OrderListQueryDto.prototype, "paymentStatus", void 0);
//# sourceMappingURL=order-list-query.dto.js.map