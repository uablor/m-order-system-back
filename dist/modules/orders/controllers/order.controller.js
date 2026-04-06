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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_command_service_1 = require("../services/order-command.service");
const order_query_service_1 = require("../services/order-query.service");
const create_full_order_dto_1 = require("../dto/create-full-order.dto");
const order_create_dto_1 = require("../dto/order-create.dto");
const order_update_dto_1 = require("../dto/order-update.dto");
const order_list_query_dto_1 = require("../dto/order-list-query.dto");
const order_response_dto_1 = require("../dto/order-response.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let OrderController = class OrderController {
    orderCommandService;
    orderQueryService;
    constructor(orderCommandService, orderQueryService) {
        this.orderCommandService = orderCommandService;
        this.orderQueryService = orderQueryService;
    }
    async merchantCreateFull(dto, currentUser) {
        return this.orderCommandService.createFull(dto, currentUser);
    }
    async merchantCreate(dto, currentUser) {
        return this.orderCommandService.create(dto, currentUser?.userId ?? null);
    }
    async adminGetList(query) {
        return this.orderQueryService.getList(query);
    }
    async adminGetSummary(query) {
        return this.orderQueryService.getSummary(query);
    }
    async merchantGetList(query, currentUser) {
        return this.orderQueryService.getListByMerchant(query, currentUser);
    }
    async merchantGetSummary(query, currentUser) {
        return this.orderQueryService.getSummaryByMerchant(query, currentUser);
    }
    async getById(id) {
        return this.orderQueryService.getByIdOrFail(id);
    }
    async merchantUpdate(id, dto) {
        return this.orderCommandService.update(id, dto);
    }
    async adminDelete(id) {
        return this.orderCommandService.delete(id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)('create-full'),
    (0, swagger_1.ApiOperation)({ summary: 'Create order with items, customer orders and customer order items in one transaction' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_full_order_dto_1.CreateFullOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "merchantCreateFull", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create order (header only)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_create_dto_1.OrderCreateDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "merchantCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List orders with pagination' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_list_query_dto_1.OrderListQueryDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order summary (admin - optional merchantId)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_list_query_dto_1.OrderListQueryDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "adminGetSummary", null);
__decorate([
    (0, common_1.Get)('by-merchant'),
    (0, swagger_1.ApiOperation)({ summary: 'List orders for the authenticated merchant (auto-filter by JWT token)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_list_query_dto_1.OrderListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "merchantGetList", null);
__decorate([
    (0, common_1.Get)('by-merchant/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order summary for the authenticated merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_list_query_dto_1.OrderListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "merchantGetSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(order_response_dto_1.OrderResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, order_update_dto_1.OrderUpdateDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "merchantUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete order' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "adminDelete", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_command_service_1.OrderCommandService,
        order_query_service_1.OrderQueryService])
], OrderController);
//# sourceMappingURL=order.controller.js.map