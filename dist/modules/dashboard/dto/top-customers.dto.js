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
exports.TopCustomersResponseDto = exports.TopCustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TopCustomerDto {
    rank;
    customerId;
    customerName;
    customerEmail;
    totalBuyAmountLak;
    orderCount;
    averageOrderAmountLak;
}
exports.TopCustomerDto = TopCustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer rank (1-5)' }),
    __metadata("design:type", Number)
], TopCustomerDto.prototype, "rank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID' }),
    __metadata("design:type", Number)
], TopCustomerDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer full name' }),
    __metadata("design:type", String)
], TopCustomerDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer email' }),
    __metadata("design:type", String)
], TopCustomerDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total buy amount (in LAK)' }),
    __metadata("design:type", Number)
], TopCustomerDto.prototype, "totalBuyAmountLak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of orders' }),
    __metadata("design:type", Number)
], TopCustomerDto.prototype, "orderCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average order amount (in LAK)' }),
    __metadata("design:type", Number)
], TopCustomerDto.prototype, "averageOrderAmountLak", void 0);
class TopCustomersResponseDto {
    customers;
}
exports.TopCustomersResponseDto = TopCustomersResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of top 5 customers', type: [TopCustomerDto] }),
    __metadata("design:type", Array)
], TopCustomersResponseDto.prototype, "customers", void 0);
//# sourceMappingURL=top-customers.dto.js.map