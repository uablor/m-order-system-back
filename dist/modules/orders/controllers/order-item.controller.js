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
exports.OrderItemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_item_query_service_1 = require("../services/order-item-query.service");
const order_item_list_query_dto_1 = require("../dto/order-item-list-query.dto");
const order_item_response_dto_1 = require("../dto/order-item-response.dto");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let OrderItemController = class OrderItemController {
    orderItemQueryService;
    constructor(orderItemQueryService) {
        this.orderItemQueryService = orderItemQueryService;
    }
    async getList(query) {
        return this.orderItemQueryService.getList(query);
    }
    async getListByMerchant(query, currentUser) {
        return this.orderItemQueryService.getListByMerchant(query, currentUser);
    }
    async getById(id, filter) {
        if (filter === 'sku') {
            return this.orderItemQueryService.getByOrderItemSkuIdOrFail(id);
        }
        return this.orderItemQueryService.getByIdOrFail(id);
    }
};
exports.OrderItemController = OrderItemController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List order items with pagination (optional orderId filter)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_item_list_query_dto_1.OrderItemListQueryDto]),
    __metadata("design:returntype", Promise)
], OrderItemController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)('by-merchant'),
    (0, swagger_1.ApiOperation)({ summary: 'List order items for the authenticated merchant (latest first)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_item_list_query_dto_1.OrderItemListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OrderItemController.prototype, "getListByMerchant", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order item by ID or order item SKU ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order item ID or Order item SKU ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(order_item_response_dto_1.OrderItemResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('filter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrderItemController.prototype, "getById", null);
exports.OrderItemController = OrderItemController = __decorate([
    (0, swagger_1.ApiTags)('Order Items'),
    (0, common_1.Controller)('order-items'),
    __metadata("design:paramtypes", [order_item_query_service_1.OrderItemQueryService])
], OrderItemController);
//# sourceMappingURL=order-item.controller.js.map