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
exports.ExchangeRateUpdateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const RATE_TYPES = ['BUY', 'SELL'];
class ExchangeRateUpdateDto {
    baseCurrency;
    targetCurrency;
    rateType;
    rate;
    rateDate;
    isActive;
}
exports.ExchangeRateUpdateDto = ExchangeRateUpdateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'USD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExchangeRateUpdateDto.prototype, "baseCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'LAK' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExchangeRateUpdateDto.prototype, "targetCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: RATE_TYPES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(RATE_TYPES),
    __metadata("design:type", Object)
], ExchangeRateUpdateDto.prototype, "rateType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExchangeRateUpdateDto.prototype, "rate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-02-13' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExchangeRateUpdateDto.prototype, "rateDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExchangeRateUpdateDto.prototype, "isActive", void 0);
//# sourceMappingURL=exchange-rate-update.dto.js.map