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
exports.CustomerOrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_order_query_service_1 = require("../services/customer-order-query.service");
const customer_order_list_query_dto_1 = require("../dto/customer-order-list-query.dto");
const customer_order_response_dto_1 = require("../dto/customer-order-response.dto");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let CustomerOrderController = class CustomerOrderController {
    customerOrderQueryService;
    constructor(customerOrderQueryService) {
        this.customerOrderQueryService = customerOrderQueryService;
    }
    async getList(query, currentUser) {
        const queryWithMerchant = { ...query, merchantId: currentUser.merchantId || undefined };
        return this.customerOrderQueryService.getList(queryWithMerchant);
    }
    async getByToken(query) {
        return this.customerOrderQueryService.getList(query);
    }
    async getSummaryByToken(query) {
        return this.customerOrderQueryService.getSummary(query);
    }
    async getById(id) {
        return this.customerOrderQueryService.getByIdOrFail(id);
    }
};
exports.CustomerOrderController = CustomerOrderController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiOperation)({ summary: 'List customer orders for authenticated merchant (auto-filter by JWT token)' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_order_list_query_dto_1.CustomerOrderListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerOrderController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)('by-token'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer orders by customer token (public — no JWT needed)' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_order_list_query_dto_1.CustomerOrderListQueryDto]),
    __metadata("design:returntype", Promise)
], CustomerOrderController.prototype, "getByToken", null);
__decorate([
    (0, common_1.Get)('summary-by-token'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer orders by customer token (public — no JWT needed)' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_order_list_query_dto_1.TokenQueryDto]),
    __metadata("design:returntype", Promise)
], CustomerOrderController.prototype, "getSummaryByToken", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer order by ID (public)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer order ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(customer_order_response_dto_1.CustomerOrderResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerOrderController.prototype, "getById", null);
exports.CustomerOrderController = CustomerOrderController = __decorate([
    (0, swagger_1.ApiTags)('Customer Orders'),
    (0, common_1.Controller)('customer-orders'),
    __metadata("design:paramtypes", [customer_order_query_service_1.CustomerOrderQueryService])
], CustomerOrderController);
//# sourceMappingURL=customer-order.controller.js.map