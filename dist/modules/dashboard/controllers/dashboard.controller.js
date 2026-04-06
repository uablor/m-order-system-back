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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_query_service_1 = require("../services/dashboard-query.service");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const admin_dashboard_details_dto_1 = require("../dto/admin-dashboard-details.dto");
const admin_dashboard_summary_dto_1 = require("../dto/admin-dashboard-summary.dto");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
const merchant_summary_dto_1 = require("../dto/merchant-summary.dto");
const merchant_price_currency_summary_dto_1 = require("../dto/merchant-price-currency-summary.dto");
const top_customers_dto_1 = require("../dto/top-customers.dto");
let DashboardController = class DashboardController {
    dashboardQueryService;
    constructor(dashboardQueryService) {
        this.dashboardQueryService = dashboardQueryService;
    }
    async adminGetDashboardSummary() {
        const data = await this.dashboardQueryService.getAdminDashboardSummary();
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async adminGetDashboardDetails() {
        const data = await this.dashboardQueryService.getAdminDashboardDetails();
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async merchantGetSummary(currentUser) {
        const data = await this.dashboardQueryService.getMerchantSummary(currentUser.merchantId);
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async merchantGetPriceCurrencySummary(currentUser) {
        const data = await this.dashboardQueryService.getMerchantPriceCurrencySummary(currentUser.merchantId);
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async adminGetMerchantPriceCurrencySummary(currentUser, body) {
        const data = await this.dashboardQueryService.getMerchantPriceCurrencySummary(body.merchantId);
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async getMerchantPriceCurrencySummaryByDate(currentUser, body) {
        const data = await this.dashboardQueryService.getMerchantPriceCurrencySummaryByDate(currentUser.merchantId, body.startDate, body.endDate);
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async getTopCustomersByBuyOrder(currentUser) {
        const data = await this.dashboardQueryService.getTopCustomersByBuyOrder(currentUser.merchantId);
        return (0, response_helper_1.createSingleResponse)(data);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('admin/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin dashboard summary - total counts' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(admin_dashboard_summary_dto_1.AdminDashboardSummaryResponseDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "adminGetDashboardSummary", null);
__decorate([
    (0, common_1.Get)('admin/details'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin dashboard details - top merchants and recent user logins' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(admin_dashboard_details_dto_1.AdminDashboardDetailsResponseDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "adminGetDashboardDetails", null);
__decorate([
    (0, common_1.Get)('merchant/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Merchant summary - current merchant stats' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_summary_dto_1.MerchantSummaryResponseDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "merchantGetSummary", null);
__decorate([
    (0, common_1.Post)('merchant/price-currency-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Merchant price currency summary - grouped by target currency' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_price_currency_summary_dto_1.MerchantPriceCurrencySummaryDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "merchantGetPriceCurrencySummary", null);
__decorate([
    (0, common_1.Post)('admin/merchant-price-currency-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Get merchant price currency summary by merchant ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_price_currency_summary_dto_1.MerchantPriceCurrencySummaryDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "adminGetMerchantPriceCurrencySummary", null);
__decorate([
    (0, common_1.Post)('merchant/price-currency-summary-by-date'),
    (0, swagger_1.ApiOperation)({ summary: 'Merchant price currency summary - grouped by target currency' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_price_currency_summary_dto_1.MerchantPriceCurrencySummaryDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, merchant_price_currency_summary_dto_1.MerchantGetPriceCurrencySummaryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMerchantPriceCurrencySummaryByDate", null);
__decorate([
    (0, common_1.Get)('merchant/top-customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Top 5 customers by buy order amount' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(top_customers_dto_1.TopCustomersResponseDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTopCustomersByBuyOrder", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_query_service_1.DashboardQueryService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map