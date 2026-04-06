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
exports.MerchantSummaryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MerchantSummaryResponseDto {
    totalUsers;
    totalCustomers;
    totalOrders;
    totalPaidOrders;
    totalArrivals;
    totalOrderItems;
}
exports.MerchantSummaryResponseDto = MerchantSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total users with this merchant' }),
    __metadata("design:type", Number)
], MerchantSummaryResponseDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total customers with this merchant' }),
    __metadata("design:type", Number)
], MerchantSummaryResponseDto.prototype, "totalCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders with this merchant' }),
    __metadata("design:type", Number)
], MerchantSummaryResponseDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total paid orders with this merchant' }),
    __metadata("design:type", Number)
], MerchantSummaryResponseDto.prototype, "totalPaidOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total arrivals with this merchant' }),
    __metadata("design:type", Number)
], MerchantSummaryResponseDto.prototype, "totalArrivals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total order items with this merchant' }),
    __metadata("design:type", Number)
], MerchantSummaryResponseDto.prototype, "totalOrderItems", void 0);
//# sourceMappingURL=merchant-summary.dto.js.map