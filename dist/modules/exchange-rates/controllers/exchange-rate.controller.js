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
exports.ExchangeRateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const exchange_rate_command_service_1 = require("../services/exchange-rate-command.service");
const exchange_rate_query_service_1 = require("../services/exchange-rate-query.service");
const exchange_rate_create_dto_1 = require("../dto/exchange-rate-create.dto");
const exchange_rate_update_dto_1 = require("../dto/exchange-rate-update.dto");
const exchange_rate_list_query_dto_1 = require("../dto/exchange-rate-list-query.dto");
const exchange_rate_response_dto_1 = require("../dto/exchange-rate-response.dto");
const exchange_rate_today_response_dto_1 = require("../dto/exchange-rate-today-response.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let ExchangeRateController = class ExchangeRateController {
    commandService;
    queryService;
    constructor(commandService, queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }
    async merchantCreate(dto, currentUser) {
        return this.commandService.create(dto, currentUser);
    }
    async merchantCreateMany(dto, currentUser) {
        return this.commandService.createMany(dto, currentUser);
    }
    async adminGetList(query) {
        return this.queryService.getList(query);
    }
    async merchantGetList(query, currentUser) {
        return this.queryService.getList(query, currentUser);
    }
    async merchantGetTodayRates(currentUser) {
        return this.queryService.getTodayRates(currentUser);
    }
    async getById(id) {
        return this.queryService.getByIdOrFail(id);
    }
    async adminUpdate(id, dto) {
        return this.commandService.update(id, dto);
    }
    async merchantUpdate(id, dto, currentUser) {
        return this.commandService.update(id, dto, currentUser);
    }
    async adminDelete(id) {
        return this.commandService.delete(id);
    }
};
exports.ExchangeRateController = ExchangeRateController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create exchange rate' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exchange_rate_create_dto_1.ExchangeRateCreateDto, Object]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "merchantCreate", null);
__decorate([
    (0, common_1.Post)('/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple exchange rates' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exchange_rate_create_dto_1.ExchangeRateCreateManyDto, Object]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "merchantCreateMany", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List exchange rates with pagination' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exchange_rate_list_query_dto_1.ExchangeRateListQueryDto]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Get)('/by-merchant'),
    (0, swagger_1.ApiOperation)({ summary: 'List exchange rates by merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exchange_rate_list_query_dto_1.ExchangeRateListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "merchantGetList", null);
__decorate([
    (0, common_1.Get)('/today'),
    (0, swagger_1.ApiOperation)({
        summary: "Get today's active BUY & SELL exchange rates",
        description: "Returns up to 2 active exchange rates for today. Merchant from Bearer token.",
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiOkResponse)({
        description: "Today's active exchange rates",
        type: exchange_rate_today_response_dto_1.ExchangeRateTodayResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Token does not carry a merchant context',
    }),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "merchantGetTodayRates", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get exchange rate by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exchange rate ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(exchange_rate_response_dto_1.ExchangeRateResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update exchange rate' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exchange rate ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, exchange_rate_update_dto_1.ExchangeRateUpdateDto]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "adminUpdate", null);
__decorate([
    (0, common_1.Patch)(':id/by-merchant'),
    (0, swagger_1.ApiOperation)({ summary: 'Update exchange rate by merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exchange rate ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, exchange_rate_update_dto_1.ExchangeRateUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "merchantUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete exchange rate' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exchange rate ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "adminDelete", null);
exports.ExchangeRateController = ExchangeRateController = __decorate([
    (0, swagger_1.ApiTags)('Exchange Rates'),
    (0, common_1.Controller)('exchange-rates'),
    __metadata("design:paramtypes", [exchange_rate_command_service_1.ExchangeRateCommandService,
        exchange_rate_query_service_1.ExchangeRateQueryService])
], ExchangeRateController);
//# sourceMappingURL=exchange-rate.controller.js.map