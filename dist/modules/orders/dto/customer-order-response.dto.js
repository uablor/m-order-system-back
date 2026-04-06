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
exports.CustomerOrderResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const payment_enum_1 = require("../../payments/enum/payment.enum");
class CustomerOrderItemResponseDto {
    id;
    orderItemSkuId;
    variant;
    quantity;
    sellingPriceForeign;
    purchasePrice;
    purchaseTotal;
    sellingTotal;
    profit;
    productName;
    orderItemId;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "orderItemSkuId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CustomerOrderItemResponseDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "sellingPriceForeign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "purchaseTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "sellingTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "profit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], CustomerOrderItemResponseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], CustomerOrderItemResponseDto.prototype, "orderItemId", void 0);
class CustomerOrderResponseDto {
    id;
    orderId;
    orderCode;
    customerId;
    customerName;
    customerToken;
    totalSellingAmount;
    totalPaid;
    remainingAmount;
    targetCurrencyTotalSellingAmount;
    targetCurrencyTotalPaid;
    targetCurrencyRemainingAmount;
    paymentStatus;
    hasPendingPayment;
    customerOrderItems;
    createdAt;
    updatedAt;
}
exports.CustomerOrderResponseDto = CustomerOrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order code from order table (e.g. ORD-001)' }),
    __metadata("design:type", Object)
], CustomerOrderResponseDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "customerToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "totalSellingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "totalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "remainingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "targetCurrencyTotalSellingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "targetCurrencyTotalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "targetCurrencyRemainingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this order has a pending payment waiting for approval' }),
    __metadata("design:type", Boolean)
], CustomerOrderResponseDto.prototype, "hasPendingPayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CustomerOrderItemResponseDto] }),
    __metadata("design:type", Array)
], CustomerOrderResponseDto.prototype, "customerOrderItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CustomerOrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CustomerOrderResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=customer-order-response.dto.js.map