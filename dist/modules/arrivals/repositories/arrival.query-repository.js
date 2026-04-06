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
exports.ArrivalQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const arrival_orm_entity_1 = require("../entities/arrival.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const base_query_enum_1 = require("../../../common/base/enums/base.query.enum");
let ArrivalQueryRepository = class ArrivalQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo
            .createQueryBuilder('arrival')
            .leftJoinAndSelect('arrival.order', 'order')
            .leftJoinAndSelect('arrival.merchant', 'merchant')
            .leftJoinAndSelect('arrival.recordedByUser', 'recordedByUser')
            .leftJoinAndSelect('arrival.arrivalItems', 'arrivalItems')
            .leftJoinAndSelect('arrivalItems.orderItem', 'orderItem')
            .leftJoinAndSelect('orderItem.image', 'image')
            .leftJoinAndSelect('orderItem.skus', 'skus')
            .leftJoinAndSelect('order.customerOrders', 'customerOrders')
            .leftJoinAndSelect('customerOrders.customer', 'customer')
            .leftJoinAndSelect('customerOrders.notification', 'notification');
        if (options.merchantId != null) {
            qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
        }
        if (options.orderId != null) {
            qb.andWhere('order.id = :orderId', { orderId: options.orderId });
        }
        if (options.orderItemId != null) {
            qb.andWhere('EXISTS (SELECT 1 FROM arrival_items ai WHERE ai.arrival_id = arrival.id AND ai.order_item_id = :orderItemId)', { orderItemId: options.orderItemId });
        }
        if (options.startDate) {
            qb.andWhere('DATE(arrival.arrivedDate) >= :startDate', { startDate: options.startDate });
        }
        if (options.endDate) {
            qb.andWhere('DATE(arrival.arrivedDate) <= :endDate', { endDate: options.endDate });
        }
        if (options.search) {
            const searchVal = `%${options.search}%`;
            if (options.searchField === 'notes') {
                qb.andWhere('arrival.notes LIKE :search', { search: searchVal });
            }
            else {
                qb.andWhere('order.orderCode LIKE :search', { search: searchVal });
            }
        }
        if (options.createdByUserId != null) {
            qb.andWhere('recordedByUser.id = :createdByUserId', { createdByUserId: options.createdByUserId });
        }
        if (options.arrivalDate) {
            qb.andWhere('DATE(arrival.arrivedDate) = :arrivalDate', { arrivalDate: options.arrivalDate });
        }
        if (options.arrivalTime) {
            qb.andWhere('arrival.arrivedTime = :arrivalTime', { arrivalTime: options.arrivalTime });
        }
        if (options.arrival !== undefined) {
            if (options.arrival) {
                qb.andWhere('arrival.arrivedDate IS NOT NULL AND arrival.arrivedTime IS NOT NULL');
            }
            else {
                qb.andWhere('arrival.arrivedDate IS NULL OR arrival.arrivedTime IS NULL');
            }
        }
        if (options.customerId != null) {
            qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
        }
        if (options.notification !== undefined) {
            if (options.notification) {
                qb.andWhere('notification.id IS NOT NULL');
            }
            else {
                qb.andWhere('notification.id IS NULL');
            }
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            page: options.page ?? 1,
            search: undefined,
            limit: options.limit ?? 10,
            manager: manager || repo.manager,
            sort: options.sort || base_query_enum_1.SortDirection.DESC,
        });
    }
    async getSummary(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo
            .createQueryBuilder('arrival')
            .leftJoin('arrival.order', 'order')
            .leftJoin('arrival.merchant', 'merchant')
            .leftJoin('arrival.recordedByUser', 'recordedByUser')
            .select('COUNT(DISTINCT arrival.id)', 'totalArrivals');
        if (options.merchantId != null) {
            qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
        }
        if (options.orderId != null) {
            qb.andWhere('order.id = :orderId', { orderId: options.orderId });
        }
        if (options.orderItemId != null) {
            qb.andWhere('EXISTS (SELECT 1 FROM arrival_items ai WHERE ai.arrival_id = arrival.id AND ai.order_item_id = :orderItemId)', { orderItemId: options.orderItemId });
        }
        if (options.startDate) {
            qb.andWhere('DATE(arrival.arrivedDate) >= :startDate', { startDate: options.startDate });
        }
        if (options.endDate) {
            qb.andWhere('DATE(arrival.arrivedDate) <= :endDate', { endDate: options.endDate });
        }
        if (options.search) {
            const searchVal = `%${options.search}%`;
            if (options.searchField === 'notes') {
                qb.andWhere('arrival.notes LIKE :search', { search: searchVal });
            }
            else {
                qb.andWhere('order.orderCode LIKE :search', { search: searchVal });
            }
        }
        if (options.createdByUserId != null) {
            qb.andWhere('recordedByUser.id = :createdByUserId', { createdByUserId: options.createdByUserId });
        }
        if (options.arrivalDate) {
            qb.andWhere('DATE(arrival.arrivedDate) = :arrivalDate', { arrivalDate: options.arrivalDate });
        }
        if (options.arrivalTime) {
            qb.andWhere('arrival.arrivedTime = :arrivalTime', { arrivalTime: options.arrivalTime });
        }
        if (options.arrival !== undefined) {
            if (options.arrival) {
                qb.andWhere('arrival.arrivedDate IS NOT NULL AND arrival.arrivedTime IS NOT NULL');
            }
            else {
                qb.andWhere('arrival.arrivedDate IS NULL OR arrival.arrivedTime IS NULL');
            }
        }
        if (options.customerId) {
            qb.andWhere(`EXISTS (
          SELECT 1 FROM customer_orders co
          INNER JOIN customers c ON c.id = co.customer_id
          WHERE co.order_id = order.id AND c.customer_name LIKE :customerName
        )`, { customerId: `%${options.customerId}%` });
        }
        const raw = await qb.getRawOne();
        return { totalArrivals: Number(raw?.totalArrivals ?? 0) };
    }
};
exports.ArrivalQueryRepository = ArrivalQueryRepository;
exports.ArrivalQueryRepository = ArrivalQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(arrival_orm_entity_1.ArrivalOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArrivalQueryRepository);
//# sourceMappingURL=arrival.query-repository.js.map