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
exports.OrderItemSkuResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OrderItemSkuResponseDto {
    id;
    orderItemId;
    orderItemSkuIndex;
    variant;
    quantity;
    exchangeRateBuy;
    exchangeRateSell;
    exchangeRateBuyValue;
    exchangeRateSellValue;
    purchasePrice;
    purchaseTotal;
    sellingPriceForeign;
    sellingTotal;
    profit;
    targetCurrencyPurchaseTotal;
    targetCurrencyPurchasePrice;
    targetCurrencySellingPriceForeign;
    targetCurrencySellingTotal;
    targetCurrencyProfit;
    createdAt;
    updatedAt;
}
exports.OrderItemSkuResponseDto = OrderItemSkuResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemSkuResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemSkuResponseDto.prototype, "orderItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuResponseDto.prototype, "orderItemSkuIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuResponseDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemSkuResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuResponseDto.prototype, "exchangeRateBuy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuResponseDto.prototype, "exchangeRateSell", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuResponseDto.prototype, "exchangeRateBuyValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemSkuResponseDto.prototype, "exchangeRateSellValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "purchaseTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "sellingPriceForeign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "sellingTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "profit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "targetCurrencyPurchaseTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "targetCurrencyPurchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "targetCurrencySellingPriceForeign", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "targetCurrencySellingTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", String)
], OrderItemSkuResponseDto.prototype, "targetCurrencyProfit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderItemSkuResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderItemSkuResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=order-item-sku-response.dto.js.map