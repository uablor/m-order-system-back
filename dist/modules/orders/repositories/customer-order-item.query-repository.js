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
exports.CustomerOrderItemQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const customer_order_item_orm_entity_1 = require("../entities/customer-order-item.orm-entity");
let CustomerOrderItemQueryRepository = class CustomerOrderItemQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const page = options.page ?? 1;
        const limit = options.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (options.customerOrderId != null)
            where.customerOrder = { id: options.customerOrderId };
        if (options.orderItemSkuId != null)
            where.orderItemSku = { id: options.orderItemSkuId };
        const [data, total] = await repo.findAndCount({
            where: Object.keys(where).length ? where : undefined,
            relations: ['customerOrder', 'orderItemSku'],
            order: { id: 'ASC' },
            skip,
            take: limit,
        });
        const totalPages = Math.ceil(total / limit);
        const pagination = {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        };
        return { success: true, Code: 200, message: 'Customer order items fetched successfully', results: data, pagination };
    }
};
exports.CustomerOrderItemQueryRepository = CustomerOrderItemQueryRepository;
exports.CustomerOrderItemQueryRepository = CustomerOrderItemQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_order_item_orm_entity_1.CustomerOrderItemOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerOrderItemQueryRepository);
//# sourceMappingURL=customer-order-item.query-repository.js.map