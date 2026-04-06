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
exports.ExchangeRateCreateManyDto = exports.ExchangeRateCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const RATE_TYPES = ['BUY', 'SELL'];
class ExchangeRateCreateDto {
    baseCurrency;
    targetCurrency;
    rateType;
    rate;
}
exports.ExchangeRateCreateDto = ExchangeRateCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', description: 'Base currency code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExchangeRateCreateDto.prototype, "baseCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LAK', description: 'Target currency code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExchangeRateCreateDto.prototype, "targetCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RATE_TYPES, description: 'BUY or SELL rate' }),
    (0, class_validator_1.IsIn)(RATE_TYPES),
    __metadata("design:type", Object)
], ExchangeRateCreateDto.prototype, "rateType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000, description: 'Exchange rate value' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExchangeRateCreateDto.prototype, "rate", void 0);
class ExchangeRateCreateManyDto {
    items;
}
exports.ExchangeRateCreateManyDto = ExchangeRateCreateManyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ExchangeRateCreateDto],
        description: 'List of exchange rates',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExchangeRateCreateDto),
    __metadata("design:type", Array)
], ExchangeRateCreateManyDto.prototype, "items", void 0);
//# sourceMappingURL=exchange-rate-create.dto.js.map