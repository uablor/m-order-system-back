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
exports.MerchantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const merchant_command_service_1 = require("../services/merchant-command.service");
const merchant_query_service_1 = require("../services/merchant-query.service");
const merchant_create_dto_1 = require("../dto/merchant-create.dto");
const merchant_update_dto_1 = require("../dto/merchant-update.dto");
const merchant_list_query_dto_1 = require("../dto/merchant-list-query.dto");
const merchant_response_dto_1 = require("../dto/merchant-response.dto");
const merchant_detail_response_dto_1 = require("../dto/merchant-detail-response.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const no_cache_decorator_1 = require("../../../common/decorators/no-cache.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
const merchant_price_currency_summary_dto_1 = require("../../dashboard/dto/merchant-price-currency-summary.dto");
const dashboard_query_service_1 = require("../../dashboard/services/dashboard-query.service");
const active_dto_1 = require("../../../common/base/dtos/active.dto");
let MerchantController = class MerchantController {
    commandService;
    queryService;
    dashboardQueryService;
    constructor(commandService, queryService, dashboardQueryService) {
        this.commandService = commandService;
        this.queryService = queryService;
        this.dashboardQueryService = dashboardQueryService;
    }
    async adminCreate(dto, currentUser) {
        return this.commandService.create(currentUser.userId, dto);
    }
    async adminGetList(query) {
        return this.queryService.getList(query);
    }
    async merchantGetDetail(currentUser) {
        return this.queryService.findMerchantDetail(currentUser.userId);
    }
    async getDetailById(id) {
        return this.queryService.getDetailById(id);
    }
    async adminGetMerchantPriceCurrencySummary(currentUser) {
        const data = await this.dashboardQueryService.getMerchantPriceCurrencySummary(currentUser.merchantId);
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async adminGetMerchantPriceCurrencySummaryByDate(body) {
        const data = await this.dashboardQueryService.getMerchantPriceCurrencySummaryByDate(body.merchantId, body.startDate, body.endDate);
        return (0, response_helper_1.createSingleResponse)(data);
    }
    async getById(id) {
        return this.queryService.getByIdOrFail(id);
    }
    async adminUpdate(id, dto) {
        return this.commandService.update(id, dto);
    }
    async merchantUpdate(dto, currentUser) {
        return this.commandService.update(currentUser.merchantId, dto);
    }
    async adminUpdateActive(id, dto) {
        return this.commandService.updateActive(id, dto);
    }
    async adminDelete(id) {
        return this.commandService.delete(id);
    }
};
exports.MerchantController = MerchantController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create merchant for current user' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_create_dto_1.MerchantCreateDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "adminCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List merchants with pagination (filtered by current user)',
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_list_query_dto_1.MerchantListQueryDto]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Get)('merchant-detail'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant detail for current user',
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "merchantGetDetail", null);
__decorate([
    (0, common_1.Get)(':id/detail'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get merchant detail by ID with owner and summary',
        description: 'Returns full merchant info joined with owner user, ' +
            'and a summary (customer counts, financial summary from orders).',
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_detail_response_dto_1.MerchantDetailResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, no_cache_decorator_1.NoCache)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getDetailById", null);
__decorate([
    (0, common_1.Post)('price-currency-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Merchant price currency summary - grouped by target currency' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_price_currency_summary_dto_1.MerchantPriceCurrencySummaryDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "adminGetMerchantPriceCurrencySummary", null);
__decorate([
    (0, common_1.Post)('price-currency-summary-by-date'),
    (0, swagger_1.ApiOperation)({ summary: 'Merchant price currency summary - grouped by target currency' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_price_currency_summary_dto_1.MerchantPriceCurrencySummaryDto),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_price_currency_summary_dto_1.MerchantGetPriceCurrencySummaryDto]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "adminGetMerchantPriceCurrencySummaryByDate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(merchant_response_dto_1.MerchantResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, no_cache_decorator_1.NoCache)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, merchant_update_dto_1.MerchantUpdateDto]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "adminUpdate", null);
__decorate([
    (0, common_1.Patch)('my-merchant'),
    (0, swagger_1.ApiOperation)({ summary: 'Update merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_update_dto_1.MerchantUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "merchantUpdate", null);
__decorate([
    (0, common_1.Patch)(':id/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Update merchant active status' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, active_dto_1.AcitveDto]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "adminUpdateActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Merchant ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "adminDelete", null);
exports.MerchantController = MerchantController = __decorate([
    (0, swagger_1.ApiTags)('Merchants'),
    (0, common_1.Controller)('merchants'),
    __metadata("design:paramtypes", [merchant_command_service_1.MerchantCommandService,
        merchant_query_service_1.MerchantQueryService,
        dashboard_query_service_1.DashboardQueryService])
], MerchantController);
//# sourceMappingURL=merchant.controller.js.map