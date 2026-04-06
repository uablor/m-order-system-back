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
exports.OrderQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const order_orm_entity_1 = require("../entities/order.orm-entity");
let OrderQueryRepository = class OrderQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager, _relations) {
        const repo = this.getRepo(manager);
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(100, Math.max(1, options.limit ?? 10));
        const skip = (page - 1) * limit;
        const buildFilters = (qb) => {
            if (options.merchantId != null) {
                qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
            }
            if (options.customerId != null) {
                qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
            }
            if (options.customerName) {
                qb.andWhere('customer.customerName LIKE :customerName', {
                    customerName: `%${options.customerName}%`,
                });
            }
            if (options.search) {
                const field = options.searchField || 'orderCode';
                qb.andWhere(`order.${field} LIKE :search`, { search: `%${options.search}%` });
            }
            if (options.startDate) {
                qb.andWhere('DATE(order.orderDate) >= :startDate', { startDate: options.startDate });
            }
            if (options.endDate) {
                qb.andWhere('DATE(order.orderDate) <= :endDate', { endDate: options.endDate });
            }
            if (options.arrivalStatus) {
                qb.andWhere('order.arrivalStatus = :arrivalStatus', { arrivalStatus: options.arrivalStatus });
            }
            if (options.paymentStatus) {
                qb.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: options.paymentStatus });
            }
        };
        const qb = repo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.merchant', 'merchant')
            .leftJoinAndSelect('order.createdByUser', 'createdByUser')
            .leftJoinAndSelect('order.orderItems', 'orderItems')
            .leftJoinAndSelect('order.customerOrders', 'customerOrders')
            .leftJoinAndSelect('customerOrders.customerOrderItems', 'customerOrderItems')
            .leftJoinAndSelect('customerOrders.customer', 'customer')
            .leftJoinAndSelect('orderItems.image', 'image')
            .leftJoinAndSelect('orderItems.skus', 'skus')
            .leftJoinAndSelect('order.exchangeRateBuy', 'exchangeRateBuy')
            .leftJoinAndSelect('order.exchangeRateSell', 'exchangeRateSell')
            .leftJoinAndSelect('skus.exchangeRateBuy', 'skusExchangeRateBuy')
            .leftJoinAndSelect('skus.exchangeRateSell', 'skusExchangeRateSell');
        buildFilters(qb);
        const sortDir = options.sort === 'ASC' ? 'ASC' : 'DESC';
        qb.orderBy('order.createdAt', sortDir).skip(skip).take(limit);
        const [data, total] = await qb.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        const pagination = {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        };
        return {
            success: true,
            Code: 200,
            message: 'Orders fetched successfully',
            results: data,
            pagination,
        };
    }
    async getSummary(options, manager) {
        const repo = this.getRepo(manager);
        const buildFilters = (qb) => {
            if (options.merchantId != null) {
                qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
            }
            if (options.customerId != null) {
                qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
            }
            if (options.customerName) {
                qb.andWhere('customer.customerName LIKE :customerName', {
                    customerName: `%${options.customerName}%`,
                });
            }
            if (options.search) {
                const field = options.searchField || 'orderCode';
                qb.andWhere(`order.${field} LIKE :search`, { search: `%${options.search}%` });
            }
            if (options.startDate) {
                qb.andWhere('DATE(order.orderDate) >= :startDate', { startDate: options.startDate });
            }
            if (options.endDate) {
                qb.andWhere('DATE(order.orderDate) <= :endDate', { endDate: options.endDate });
            }
            if (options.arrivalStatus) {
                qb.andWhere('order.arrivalStatus = :arrivalStatus', { arrivalStatus: options.arrivalStatus });
            }
            if (options.paymentStatus) {
                qb.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: options.paymentStatus });
            }
        };
        const aggQb = repo
            .createQueryBuilder('order')
            .leftJoin('order.merchant', 'merchant')
            .leftJoin('order.customerOrders', 'customerOrders')
            .leftJoin('customerOrders.customer', 'customer')
            .select('COUNT(DISTINCT order.id)', 'totalOrders')
            .addSelect("COALESCE(SUM(CASE WHEN order.arrivalStatus = 'ARRIVED' THEN 1 ELSE 0 END), 0)", 'arrivedOrders')
            .addSelect("COALESCE(SUM(CASE WHEN order.arrivalStatus = 'NOT_ARRIVED' THEN 1 ELSE 0 END), 0)", 'notArrivedOrders')
            .addSelect("COALESCE(SUM(CASE WHEN order.paymentStatus = 'PAID' THEN 1 ELSE 0 END), 0)", 'paidOrders')
            .addSelect("COALESCE(SUM(CASE WHEN customerOrders.paymentStatus IN ('NOT_CREATED', 'UNPAID') THEN 1 ELSE 0 END), 0)", 'unpaidOrders');
        buildFilters(aggQb);
        const aggRaw = await aggQb.getRawOne();
        return {
            totalOrders: Number(aggRaw?.totalOrders ?? 0),
            arrivedOrders: Number(aggRaw?.arrivedOrders ?? 0),
            notArrivedOrders: Number(aggRaw?.notArrivedOrders ?? 0),
            paidOrders: Number(aggRaw?.paidOrders ?? 0),
            unpaidOrders: Number(aggRaw?.unpaidOrders ?? 0),
        };
    }
};
exports.OrderQueryRepository = OrderQueryRepository;
exports.OrderQueryRepository = OrderQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_orm_entity_1.OrderOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrderQueryRepository);
//# sourceMappingURL=order.query-repository.js.map