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
exports.ExchangeRateListQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const base_query_dto_1 = require("../../../common/base/dtos/base.query.dto");
const RATE_TYPES = ['BUY', 'SELL'];
class ExchangeRateListQueryDto extends base_query_dto_1.BaseQueryDto {
    merchantId;
    rateType;
    baseCurrency;
    targetCurrency;
    isActive;
    startDate;
    endDate;
}
exports.ExchangeRateListQueryDto = ExchangeRateListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ExchangeRateListQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: RATE_TYPES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(RATE_TYPES),
    __metadata("design:type", Object)
], ExchangeRateListQueryDto.prototype, "rateType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'USD' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExchangeRateListQueryDto.prototype, "baseCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'LAK' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExchangeRateListQueryDto.prototype, "targetCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], ExchangeRateListQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'format YYYY-MM-DD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], ExchangeRateListQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'format YYYY-MM-DD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], ExchangeRateListQueryDto.prototype, "endDate", void 0);
//# sourceMappingURL=exchange-rate-list-query.dto.js.map