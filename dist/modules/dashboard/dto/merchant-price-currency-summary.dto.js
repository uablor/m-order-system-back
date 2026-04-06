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
exports.MerchantGetPriceCurrencySummaryDto = exports.MerchantPriceCurrencySummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MerchantPriceCurrencySummaryDto {
    targetCurrency;
    totalAll;
    totalUnpaid;
    totalPaid;
    totalAllConverted;
    totalUnpaidConverted;
    totalPaidConverted;
}
exports.MerchantPriceCurrencySummaryDto = MerchantPriceCurrencySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target currency code' }),
    __metadata("design:type", String)
], MerchantPriceCurrencySummaryDto.prototype, "targetCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total price for all orders (in original currency)' }),
    __metadata("design:type", Number)
], MerchantPriceCurrencySummaryDto.prototype, "totalAll", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total price for unpaid orders (in original currency)' }),
    __metadata("design:type", Number)
], MerchantPriceCurrencySummaryDto.prototype, "totalUnpaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total price for paid orders (in original currency)' }),
    __metadata("design:type", Number)
], MerchantPriceCurrencySummaryDto.prototype, "totalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total price for all orders (converted to LAK)' }),
    __metadata("design:type", Number)
], MerchantPriceCurrencySummaryDto.prototype, "totalAllConverted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total price for unpaid orders (converted to LAK)' }),
    __metadata("design:type", Number)
], MerchantPriceCurrencySummaryDto.prototype, "totalUnpaidConverted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total price for paid orders (converted to LAK)' }),
    __metadata("design:type", Number)
], MerchantPriceCurrencySummaryDto.prototype, "totalPaidConverted", void 0);
class MerchantGetPriceCurrencySummaryDto {
    startDate;
    endDate;
    merchantId;
}
exports.MerchantGetPriceCurrencySummaryDto = MerchantGetPriceCurrencySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? new Date(value) : undefined),
    __metadata("design:type", Date)
], MerchantGetPriceCurrencySummaryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? new Date(value) : undefined),
    __metadata("design:type", Date)
], MerchantGetPriceCurrencySummaryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID', required: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MerchantGetPriceCurrencySummaryDto.prototype, "merchantId", void 0);
//# sourceMappingURL=merchant-price-currency-summary.dto.js.map