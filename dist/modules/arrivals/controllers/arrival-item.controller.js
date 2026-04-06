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
exports.ArrivalItemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const arrival_item_command_service_1 = require("../services/arrival-item-command.service");
const arrival_item_query_service_1 = require("../services/arrival-item-query.service");
const arrival_item_update_dto_1 = require("../dto/arrival-item-update.dto");
const arrival_item_list_query_dto_1 = require("../dto/arrival-item-list-query.dto");
const arrival_item_response_dto_1 = require("../dto/arrival-item-response.dto");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let ArrivalItemController = class ArrivalItemController {
    arrivalItemCommandService;
    arrivalItemQueryService;
    constructor(arrivalItemCommandService, arrivalItemQueryService) {
        this.arrivalItemCommandService = arrivalItemCommandService;
        this.arrivalItemQueryService = arrivalItemQueryService;
    }
    async merchantGetList(query) {
        return this.arrivalItemQueryService.getList(query);
    }
    async getById(id) {
        return this.arrivalItemQueryService.getByIdOrFail(id);
    }
    async merchantUpdate(id, dto) {
        return this.arrivalItemCommandService.update(id, dto);
    }
    async adminDelete(id) {
        return this.arrivalItemCommandService.delete(id);
    }
};
exports.ArrivalItemController = ArrivalItemController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List arrival items with pagination' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [arrival_item_list_query_dto_1.ArrivalItemListQueryDto]),
    __metadata("design:returntype", Promise)
], ArrivalItemController.prototype, "merchantGetList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get arrival item by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Arrival item ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(arrival_item_response_dto_1.ArrivalItemResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArrivalItemController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update arrival item' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Arrival item ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, arrival_item_update_dto_1.ArrivalItemUpdateDto]),
    __metadata("design:returntype", Promise)
], ArrivalItemController.prototype, "merchantUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete arrival item' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Arrival item ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArrivalItemController.prototype, "adminDelete", null);
exports.ArrivalItemController = ArrivalItemController = __decorate([
    (0, swagger_1.ApiTags)('Arrival Items'),
    (0, common_1.Controller)('arrival-items'),
    __metadata("design:paramtypes", [arrival_item_command_service_1.ArrivalItemCommandService,
        arrival_item_query_service_1.ArrivalItemQueryService])
], ArrivalItemController);
//# sourceMappingURL=arrival-item.controller.js.map