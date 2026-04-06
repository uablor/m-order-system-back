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
exports.CustomerOrderItemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_order_item_query_service_1 = require("../services/customer-order-item-query.service");
const customer_order_item_list_query_dto_1 = require("../dto/customer-order-item-list-query.dto");
const customer_order_item_response_dto_1 = require("../dto/customer-order-item-response.dto");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
let CustomerOrderItemController = class CustomerOrderItemController {
    customerOrderItemQueryService;
    constructor(customerOrderItemQueryService) {
        this.customerOrderItemQueryService = customerOrderItemQueryService;
    }
    async getList(query) {
        return this.customerOrderItemQueryService.getList(query);
    }
    async getById(id) {
        return this.customerOrderItemQueryService.getByIdOrFail(id);
    }
};
exports.CustomerOrderItemController = CustomerOrderItemController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'List customer order items with pagination (public)' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_order_item_list_query_dto_1.CustomerOrderItemListQueryDto]),
    __metadata("design:returntype", Promise)
], CustomerOrderItemController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer order item by ID (public)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer order item ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(customer_order_item_response_dto_1.CustomerOrderItemResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerOrderItemController.prototype, "getById", null);
exports.CustomerOrderItemController = CustomerOrderItemController = __decorate([
    (0, swagger_1.ApiTags)('Customer Order Items'),
    (0, common_1.Controller)('customer-order-items'),
    __metadata("design:paramtypes", [customer_order_item_query_service_1.CustomerOrderItemQueryService])
], CustomerOrderItemController);
//# sourceMappingURL=customer-order-item.controller.js.map