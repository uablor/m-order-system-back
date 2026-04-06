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
exports.CustomerOrderItemQueryService = void 0;
const common_1 = require("@nestjs/common");
const customer_order_item_query_repository_1 = require("../repositories/customer-order-item.query-repository");
const customer_order_item_repository_1 = require("../repositories/customer-order-item.repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let CustomerOrderItemQueryService = class CustomerOrderItemQueryService {
    customerOrderItemRepository;
    customerOrderItemQueryRepository;
    constructor(customerOrderItemRepository, customerOrderItemQueryRepository) {
        this.customerOrderItemRepository = customerOrderItemRepository;
        this.customerOrderItemQueryRepository = customerOrderItemQueryRepository;
    }
    async getById(id) {
        const entity = await this.customerOrderItemQueryRepository.repository.findOne({
            where: { id },
            relations: ['order', 'customerOrder', 'orderItemSku'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Customer order item not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query) {
        const result = await this.customerOrderItemQueryRepository.findWithPagination({
            page: query.page,
            limit: query.limit,
            customerOrderId: query.customerOrderId,
            orderItemSkuId: query.orderItemSkuId,
        });
        return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
    }
    toResponse(entity) {
        return {
            id: entity.id,
            customerOrderId: entity.customerOrder?.id ?? 0,
            orderItemSkuId: entity.orderItemSku?.id ?? 0,
            quantity: entity.quantity,
            sellingPriceForeign: entity.sellingPriceForeign.toString(),
            purchasePrice: entity.purchasePrice.toString(),
            purchaseTotal: entity.purchaseTotal.toString(),
            sellingTotal: entity.sellingTotal.toString(),
            profit: entity.profit.toString(),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.CustomerOrderItemQueryService = CustomerOrderItemQueryService;
exports.CustomerOrderItemQueryService = CustomerOrderItemQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_order_item_repository_1.CustomerOrderItemRepository,
        customer_order_item_query_repository_1.CustomerOrderItemQueryRepository])
], CustomerOrderItemQueryService);
//# sourceMappingURL=customer-order-item-query.service.js.map