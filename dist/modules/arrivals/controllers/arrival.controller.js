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
exports.ArrivalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const arrival_command_service_1 = require("../services/arrival-command.service");
const arrival_query_service_1 = require("../services/arrival-query.service");
const create_arrival_dto_1 = require("../dto/create-arrival.dto");
const create_multiple_arrivals_dto_1 = require("../dto/create-multiple-arrivals.dto");
const arrival_update_dto_1 = require("../dto/arrival-update.dto");
const arrival_list_query_dto_1 = require("../dto/arrival-list-query.dto");
const arrival_response_dto_1 = require("../dto/arrival-response.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let ArrivalController = class ArrivalController {
    arrivalCommandService;
    arrivalQueryService;
    constructor(arrivalCommandService, arrivalQueryService) {
        this.arrivalCommandService = arrivalCommandService;
        this.arrivalQueryService = arrivalQueryService;
    }
    async merchantCreate(dto, currentUser) {
        return this.arrivalCommandService.create(dto, currentUser);
    }
    async merchantCreateMultiple(dto, currentUser) {
        return this.arrivalCommandService.createMultiple(dto, currentUser);
    }
    async adminGetList(query) {
        return this.arrivalQueryService.getList(query);
    }
    async adminGetSummary(query) {
        return this.arrivalQueryService.getSummary(query);
    }
    async merchantGetList(query, currentUser) {
        return this.arrivalQueryService.getListByMerchant(query, currentUser);
    }
    async merchantGetSummary(query, currentUser) {
        return this.arrivalQueryService.getSummaryByMerchant(query, currentUser);
    }
    async getById(id) {
        return this.arrivalQueryService.getByIdOrFail(id);
    }
    async merchantUpdate(id, dto) {
        return this.arrivalCommandService.update(id, dto);
    }
    async adminDelete(id) {
        return this.arrivalCommandService.delete(id);
    }
};
exports.ArrivalController = ArrivalController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Record arrival, create arrival items, update stock, and send notifications' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_arrival_dto_1.CreateArrivalDto, Object]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "merchantCreate", null);
__decorate([
    (0, common_1.Post)('create-multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Record multiple arrivals for different orders in a single transaction' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_multiple_arrivals_dto_1.CreateMultipleArrivalsDto, Object]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "merchantCreateMultiple", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List arrivals with pagination' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [arrival_list_query_dto_1.ArrivalListQueryDto]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get arrival summary (admin - optional merchantId)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [arrival_list_query_dto_1.ArrivalListQueryDto]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "adminGetSummary", null);
__decorate([
    (0, common_1.Get)('by-merchant'),
    (0, swagger_1.ApiOperation)({ summary: 'List arrivals for the authenticated merchant (auto-filter by JWT token)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [arrival_list_query_dto_1.ArrivalListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "merchantGetList", null);
__decorate([
    (0, common_1.Get)('by-merchant/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get arrival summary for the authenticated merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [arrival_list_query_dto_1.ArrivalListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "merchantGetSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get arrival by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Arrival ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(arrival_response_dto_1.ArrivalResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update arrival' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Arrival ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, arrival_update_dto_1.ArrivalUpdateDto]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "merchantUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete arrival' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Arrival ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArrivalController.prototype, "adminDelete", null);
exports.ArrivalController = ArrivalController = __decorate([
    (0, swagger_1.ApiTags)('Arrivals'),
    (0, common_1.Controller)('arrivals'),
    __metadata("design:paramtypes", [arrival_command_service_1.ArrivalCommandService,
        arrival_query_service_1.ArrivalQueryService])
], ArrivalController);
//# sourceMappingURL=arrival.controller.js.map