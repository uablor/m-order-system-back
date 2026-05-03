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
exports.CreateFullOrderDto = exports.CreateFullCustomerOrderDto = exports.CreateFullCustomerOrderItemDto = exports.CreateFullOrderItemDto = exports.CreateFullOrderItemSkuDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateFullOrderItemSkuDto {
    orderItemSkuIndex;
    variant;
    quantity;
    purchasePrice;
    sellingPriceForeign;
    exchangeRateBuyId;
    exchangeRateSellId;
}
exports.CreateFullOrderItemSkuDto = CreateFullOrderItemSkuDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFullOrderItemSkuDto.prototype, "orderItemSkuIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateFullOrderItemSkuDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFullOrderItemSkuDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullOrderItemSkuDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullOrderItemSkuDto.prototype, "sellingPriceForeign", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exchange rate ID for purchase (foreign -> LAK)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFullOrderItemSkuDto.prototype, "exchangeRateBuyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exchange rate ID for selling (LAK -> foreign)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFullOrderItemSkuDto.prototype, "exchangeRateSellId", void 0);
class CreateFullOrderItemDto {
    Index = 0;
    productName;
    skus;
    imageId;
}
exports.CreateFullOrderItemDto = CreateFullOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Index of order item in the items array (0-based)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullOrderItemDto.prototype, "Index", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateFullOrderItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateFullOrderItemSkuDto], description: 'SKUs for this order item' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateFullOrderItemSkuDto),
    __metadata("design:type", Array)
], CreateFullOrderItemDto.prototype, "skus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product image ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFullOrderItemDto.prototype, "imageId", void 0);
class CreateFullCustomerOrderItemDto {
    orderItemIndex;
    skuIndex;
    quantity;
    sellingPriceForeign;
}
exports.CreateFullCustomerOrderItemDto = CreateFullCustomerOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Index of order item in the items array (0-based)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullCustomerOrderItemDto.prototype, "orderItemIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Index of SKU within the order item (0-based)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullCustomerOrderItemDto.prototype, "skuIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFullCustomerOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Override selling price in foreign currency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullCustomerOrderItemDto.prototype, "sellingPriceForeign", void 0);
class CreateFullCustomerOrderDto {
    customerId;
    items;
    discountType;
    discountValue;
}
exports.CreateFullCustomerOrderDto = CreateFullCustomerOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFullCustomerOrderDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateFullCustomerOrderItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateFullCustomerOrderItemDto),
    __metadata("design:type", Array)
], CreateFullCustomerOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['PERCENT', 'FIX'], description: 'PERCENT = ສ່ວນຫຼຸດເປີເຊັນ, FIX = ສ່ວນຫຼຸດເງິນສົດ (at customer order level)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['PERCENT', 'FIX']),
    __metadata("design:type", String)
], CreateFullCustomerOrderDto.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Discount value (percentage or fixed amount)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullCustomerOrderDto.prototype, "discountValue", void 0);
class CreateFullOrderDto {
    orderCode;
    shippingExchangeRateId;
    shippingPrice;
    items;
    customerOrders;
}
exports.CreateFullOrderDto = CreateFullOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateFullOrderDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exchange rate ID for shipping cost conversion' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFullOrderDto.prototype, "shippingExchangeRateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipping price per unit in foreign currency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFullOrderDto.prototype, "shippingPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateFullOrderItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateFullOrderItemDto),
    __metadata("design:type", Array)
], CreateFullOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateFullCustomerOrderDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateFullCustomerOrderDto),
    __metadata("design:type", Array)
], CreateFullOrderDto.prototype, "customerOrders", void 0);
//# sourceMappingURL=create-full-order.dto.js.map