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
exports.OrderResponseDto = exports.CustomerOrderResponseDto = exports.CustomerSnapshotDto = exports.CustomerOrderItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const order_item_response_dto_1 = require("./order-item-response.dto");
class CustomerOrderItemResponseDto {
    id;
    customerOrderId;
    orderItemSkuId;
    variant;
    quantity;
    sellingPriceForeign;
    purchasePrice;
    purchaseTotal;
    sellingTotal;
    profit;
    createdAt;
    updatedAt;
}
exports.CustomerOrderItemResponseDto = CustomerOrderItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "customerOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "orderItemSkuId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], CustomerOrderItemResponseDto.prototype, "variant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderItemResponseDto.prototype, "sellingPriceForeign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderItemResponseDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderItemResponseDto.prototype, "purchaseTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderItemResponseDto.prototype, "sellingTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderItemResponseDto.prototype, "profit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CustomerOrderItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CustomerOrderItemResponseDto.prototype, "updatedAt", void 0);
class CustomerSnapshotDto {
    id;
    customerName;
    customerType;
}
exports.CustomerSnapshotDto = CustomerSnapshotDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerSnapshotDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerSnapshotDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerSnapshotDto.prototype, "customerType", void 0);
class CustomerOrderResponseDto {
    id;
    orderId;
    customerId;
    customer;
    totalSellingAmount;
    paidAmount;
    remainingAmount;
    targetCurrencyTotalSellingAmount;
    targetCurrencyPaidAmount;
    targetCurrencyRemainingAmount;
    paymentStatus;
    discountType;
    discountValue;
    discountAmount;
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
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CustomerOrderResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, type: () => CustomerSnapshotDto }),
    __metadata("design:type", Object)
], CustomerOrderResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "totalSellingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "paidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "remainingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "targetCurrencyTotalSellingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "targetCurrencyPaidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "targetCurrencyRemainingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerOrderResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], CustomerOrderResponseDto.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], CustomerOrderResponseDto.prototype, "discountValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], CustomerOrderResponseDto.prototype, "discountAmount", void 0);
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
class OrderResponseDto {
    id;
    merchantId;
    createdByUser;
    orderCode;
    orderDate;
    arrivalStatus;
    arrivedAt;
    notifiedAt;
    exchangeRateBuy;
    exchangeRateSell;
    shippingExchangeRate;
    exchangeRateBuyValue;
    exchangeRateSellValue;
    totalPurchaseCost;
    totalShippingCost;
    totalCostBeforeDiscount;
    totalDiscount;
    totalFinalCost;
    totalSellingAmount;
    totalProfit;
    targetCurrencyTotalPurchaseCost;
    targetCurrencyTotalShippingCost;
    targetCurrencyTotalCostBeforeDiscount;
    targetCurrencyTotalDiscount;
    targetCurrencyTotalFinalCost;
    targetCurrencyTotalSellingAmount;
    targetCurrencyTotalProfit;
    targetCurrencyTotalShippingCostByShippingExchangeRate;
    paymentStatus;
    orderItems;
    customerOrders;
    createdAt;
    updatedAt;
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "createdByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "arrivalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "arrivedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "notifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "exchangeRateBuy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "exchangeRateSell", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "shippingExchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "exchangeRateBuyValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "exchangeRateSellValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "totalPurchaseCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "totalShippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "totalCostBeforeDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "totalDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "totalFinalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "totalSellingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "totalProfit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalPurchaseCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalShippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalCostBeforeDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalFinalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalSellingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalProfit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "targetCurrencyTotalShippingCostByShippingExchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [order_item_response_dto_1.OrderItemResponseDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "orderItems", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CustomerOrderResponseDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "customerOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=order-response.dto.js.map