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
exports.ExchangeRateResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ExchangeRateResponseDto {
    id;
    merchantId;
    baseCurrency;
    targetCurrency;
    rateType;
    rate;
    isActive;
    rateDate;
    createdBy;
    createdAt;
    updatedAt;
    constructor(partial) {
        this.id = partial.id ?? 0;
        this.merchantId = partial.merchantId ?? 0;
        this.baseCurrency = partial.baseCurrency ?? '';
        this.targetCurrency = partial.targetCurrency ?? '';
        this.rateType = partial.rateType ?? 'BUY';
        this.rate = partial.rate ?? '';
        this.isActive = partial.isActive ?? false;
        this.rateDate = partial.rateDate ?? '';
        this.createdBy = partial.createdBy ?? null;
        this.createdAt = partial.createdAt ?? new Date();
        this.updatedAt = partial.updatedAt ?? new Date();
    }
}
exports.ExchangeRateResponseDto = ExchangeRateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExchangeRateResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExchangeRateResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD' }),
    __metadata("design:type", String)
], ExchangeRateResponseDto.prototype, "baseCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LAK' }),
    __metadata("design:type", String)
], ExchangeRateResponseDto.prototype, "targetCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['BUY', 'SELL'] }),
    __metadata("design:type", String)
], ExchangeRateResponseDto.prototype, "rateType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExchangeRateResponseDto.prototype, "rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ExchangeRateResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-02-13' }),
    __metadata("design:type", String)
], ExchangeRateResponseDto.prototype, "rateDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ExchangeRateResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ExchangeRateResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ExchangeRateResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=exchange-rate-response.dto.js.map