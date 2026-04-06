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
exports.AdminDashboardDetailsResponseDto = exports.RecentUserDto = exports.TopMerchantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TopMerchantDto {
    id;
    shopName;
    totalOrders;
    ownerUser;
    ownerUserEmail;
}
exports.TopMerchantDto = TopMerchantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID' }),
    __metadata("design:type", Number)
], TopMerchantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shop name' }),
    __metadata("design:type", String)
], TopMerchantDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total orders count' }),
    __metadata("design:type", Number)
], TopMerchantDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner user name' }),
    __metadata("design:type", String)
], TopMerchantDto.prototype, "ownerUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner user email' }),
    __metadata("design:type", String)
], TopMerchantDto.prototype, "ownerUserEmail", void 0);
class RecentUserDto {
    id;
    fullName;
    email;
    lastLogin;
    merchant;
}
exports.RecentUserDto = RecentUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", Number)
], RecentUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name' }),
    __metadata("design:type", String)
], RecentUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email' }),
    __metadata("design:type", String)
], RecentUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last login timestamp' }),
    __metadata("design:type", Date)
], RecentUserDto.prototype, "lastLogin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant associated with user' }),
    __metadata("design:type", Object)
], RecentUserDto.prototype, "merchant", void 0);
class AdminDashboardDetailsResponseDto {
    topMerchants;
    recentUserLogins;
}
exports.AdminDashboardDetailsResponseDto = AdminDashboardDetailsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top 5 merchants by orders', type: [TopMerchantDto] }),
    __metadata("design:type", Array)
], AdminDashboardDetailsResponseDto.prototype, "topMerchants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recent 5 user logins', type: [RecentUserDto] }),
    __metadata("design:type", Array)
], AdminDashboardDetailsResponseDto.prototype, "recentUserLogins", void 0);
//# sourceMappingURL=admin-dashboard-details.dto.js.map