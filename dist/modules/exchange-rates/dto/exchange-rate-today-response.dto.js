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
exports.ExchangeRateTodayResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const exchange_rate_response_dto_1 = require("./exchange-rate-response.dto");
class ExchangeRateTodayResponseDto {
    success;
    Code;
    message;
    results;
}
exports.ExchangeRateTodayResponseDto = ExchangeRateTodayResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ExchangeRateTodayResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], ExchangeRateTodayResponseDto.prototype, "Code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Success' }),
    __metadata("design:type", String)
], ExchangeRateTodayResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [exchange_rate_response_dto_1.ExchangeRateResponseDto],
        description: 'Active exchange rates for today. Contains 0–2 items. ' +
            'Use rateType field ("BUY" | "SELL") to distinguish each item. ' +
            'An empty array means no rates have been set for today.',
        example: [
            {
                id: 1,
                merchantId: 5,
                baseCurrency: 'CNY',
                targetCurrency: 'LAK',
                rateType: 'BUY',
                rate: '24500.000000',
                isActive: true,
                rateDate: '2025-02-18',
                createdBy: 10,
                createdAt: '2025-02-18T08:00:00.000Z',
                updatedAt: '2025-02-18T08:00:00.000Z',
            },
            {
                id: 2,
                merchantId: 5,
                baseCurrency: 'CNY',
                targetCurrency: 'LAK',
                rateType: 'SELL',
                rate: '25000.000000',
                isActive: true,
                rateDate: '2025-02-18',
                createdBy: 10,
                createdAt: '2025-02-18T08:00:00.000Z',
                updatedAt: '2025-02-18T08:00:00.000Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], ExchangeRateTodayResponseDto.prototype, "results", void 0);
//# sourceMappingURL=exchange-rate-today-response.dto.js.map