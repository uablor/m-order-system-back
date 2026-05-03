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
exports.OrderItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const order_item_sku_response_dto_1 = require("./order-item-sku-response.dto");
class OrderItemResponseDto {
    id;
    orderId;
    productName;
    orderItemIndex;
    imageId;
    image;
    exchangeRateBuy;
    exchangeRateSell;
    shippingExchangeRate;
    exchangeRateBuyValue;
    exchangeRateSellValue;
    quantity;
    purchaseTotal;
    finalCost;
    sellingTotal;
    profit;
    targetCurrencyPurchasePrice;
    targetCurrencySellingPriceForeign;
    targetCurrencyPurchaseTotal;
    targetCurrencySellingTotal;
    targetCurrencyProfit;
    targetCurrencyFinalCost;
    skus;
    createdAt;
    updatedAt;
}
exports.OrderItemResponseDto = OrderItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "orderItemIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "imageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "exchangeRateBuy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "exchangeRateSell", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "shippingExchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "exchangeRateBuyValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "exchangeRateSellValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "purchaseTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "finalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "sellingTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "profit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "targetCurrencyPurchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "targetCurrencySellingPriceForeign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "targetCurrencyPurchaseTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "targetCurrencySellingTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "targetCurrencyProfit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "targetCurrencyFinalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [order_item_sku_response_dto_1.OrderItemSkuResponseDto] }),
    __metadata("design:type", Array)
], OrderItemResponseDto.prototype, "skus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderItemResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=order-item-response.dto.js.map