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
exports.MerchantResponseDto = exports.MerchantDetailResponseDto = exports.MerchantDetailSummaryDto = exports.MerchantDetailFinancialDto = exports.MerchantDetailUserDto = exports.MerchantFinancialByCurrencyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const image_orm_entity_1 = require("../../images/entities/image.orm-entity");
class MerchantFinancialByCurrencyDto {
    baseCurrency;
    totalOrders;
    totalIncomeLak;
    totalExpenseLak;
    totalProfitLak;
}
exports.MerchantFinancialByCurrencyDto = MerchantFinancialByCurrencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base currency code (e.g. THB, USD, CNY)' }),
    __metadata("design:type", String)
], MerchantFinancialByCurrencyDto.prototype, "baseCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of orders using this currency' }),
    __metadata("design:type", Number)
], MerchantFinancialByCurrencyDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total income in LAK (selling amount)' }),
    __metadata("design:type", Number)
], MerchantFinancialByCurrencyDto.prototype, "totalIncomeLak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total expense in LAK (final cost)' }),
    __metadata("design:type", Number)
], MerchantFinancialByCurrencyDto.prototype, "totalExpenseLak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total profit in LAK' }),
    __metadata("design:type", Number)
], MerchantFinancialByCurrencyDto.prototype, "totalProfitLak", void 0);
class MerchantDetailUserDto {
    id;
    email;
    fullName;
    roleId;
    roleName;
    isActive;
    createdAt;
    lastLogin;
}
exports.MerchantDetailUserDto = MerchantDetailUserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MerchantDetailUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantDetailUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantDetailUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MerchantDetailUserDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MerchantDetailUserDto.prototype, "roleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MerchantDetailUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MerchantDetailUserDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantDetailUserDto.prototype, "lastLogin", void 0);
class MerchantDetailFinancialDto {
    totalOrders;
    ordersUnpaid;
    ordersPartial;
    ordersPaid;
    totalIncomeLak;
    totalIncomeThb;
    totalExpenseLak;
    totalExpenseThb;
    totalProfitLak;
    totalProfitThb;
    totalPaidAmount;
    totalRemainingAmount;
    byCurrency;
}
exports.MerchantDetailFinancialDto = MerchantDetailFinancialDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders count' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders with UNPAID status' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "ordersUnpaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders with PARTIAL status' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "ordersPartial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orders with PAID status' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "ordersPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total income in LAK (sum of total_selling_amount)' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalIncomeLak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total income in THB (always 0 — reserved)' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalIncomeThb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total expense in LAK (sum of total_final_cost)' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalExpenseLak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total expense in THB (always 0 — reserved)' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalExpenseThb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total profit in LAK' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalProfitLak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total profit in THB (always 0 — reserved)' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalProfitThb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total paid amount across all customer orders' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalPaidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total remaining / outstanding amount' }),
    __metadata("design:type", Number)
], MerchantDetailFinancialDto.prototype, "totalRemainingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [MerchantFinancialByCurrencyDto],
        description: 'Financial breakdown grouped by baseCurrency of the buy exchange rate',
    }),
    __metadata("design:type", Array)
], MerchantDetailFinancialDto.prototype, "byCurrency", void 0);
class MerchantDetailSummaryDto {
    totalCustomers;
    activeCustomers;
    inactiveCustomers;
    customerTypeCustomer;
    customerTypeAgent;
    financial;
}
exports.MerchantDetailSummaryDto = MerchantDetailSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total customers of this merchant' }),
    __metadata("design:type", Number)
], MerchantDetailSummaryDto.prototype, "totalCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active customers count' }),
    __metadata("design:type", Number)
], MerchantDetailSummaryDto.prototype, "activeCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inactive customers count' }),
    __metadata("design:type", Number)
], MerchantDetailSummaryDto.prototype, "inactiveCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customers of type CUSTOMER' }),
    __metadata("design:type", Number)
], MerchantDetailSummaryDto.prototype, "customerTypeCustomer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customers of type AGENT' }),
    __metadata("design:type", Number)
], MerchantDetailSummaryDto.prototype, "customerTypeAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MerchantDetailFinancialDto, description: 'Financial summary from orders' }),
    __metadata("design:type", MerchantDetailFinancialDto)
], MerchantDetailSummaryDto.prototype, "financial", void 0);
class MerchantDetailResponseDto {
    id;
    ownerUserId;
    shopName;
    shopLogoUrl;
    shopAddress;
    contactPhone;
    contactEmail;
    contactFacebook;
    contactLine;
    contactWhatsapp;
    defaultCurrency;
    isActive;
    createdAt;
    updatedAt;
    owner;
    summary;
}
exports.MerchantDetailResponseDto = MerchantDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MerchantDetailResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MerchantDetailResponseDto.prototype, "ownerUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantDetailResponseDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, type: () => image_orm_entity_1.ImageOrmEntity }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "shopLogoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "shopAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "contactFacebook", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "contactLine", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "contactWhatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantDetailResponseDto.prototype, "defaultCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MerchantDetailResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MerchantDetailResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MerchantDetailResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MerchantDetailUserDto, nullable: true, description: 'Owner user info' }),
    __metadata("design:type", Object)
], MerchantDetailResponseDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MerchantDetailSummaryDto }),
    __metadata("design:type", MerchantDetailSummaryDto)
], MerchantDetailResponseDto.prototype, "summary", void 0);
class MerchantResponseDto {
    id;
    ownerUserId;
    shopName;
    shopLogoUrl;
    shopAddress;
    contactPhone;
    contactEmail;
    contactFacebook;
    contactLine;
    contactWhatsapp;
    defaultCurrency;
    isActive;
    createdAt;
    updatedAt;
}
exports.MerchantResponseDto = MerchantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MerchantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MerchantResponseDto.prototype, "ownerUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantResponseDto.prototype, "shopLogoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantResponseDto.prototype, "shopAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantResponseDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantResponseDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantResponseDto.prototype, "contactFacebook", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantResponseDto.prototype, "contactLine", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], MerchantResponseDto.prototype, "contactWhatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MerchantResponseDto.prototype, "defaultCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MerchantResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MerchantResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MerchantResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=merchant-detail-response.dto.js.map