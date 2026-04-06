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
exports.AdminDashboardSummaryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AdminDashboardSummaryResponseDto {
    totalMerchants;
    totalAdminUsers;
    totalMerchantUsers;
    totalOrders;
}
exports.AdminDashboardSummaryResponseDto = AdminDashboardSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of merchants' }),
    __metadata("design:type", Number)
], AdminDashboardSummaryResponseDto.prototype, "totalMerchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of admin users (users without merchantId)' }),
    __metadata("design:type", Number)
], AdminDashboardSummaryResponseDto.prototype, "totalAdminUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of users with merchantId' }),
    __metadata("design:type", Number)
], AdminDashboardSummaryResponseDto.prototype, "totalMerchantUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of orders' }),
    __metadata("design:type", Number)
], AdminDashboardSummaryResponseDto.prototype, "totalOrders", void 0);
//# sourceMappingURL=admin-dashboard-summary.dto.js.map