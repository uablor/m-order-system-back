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
exports.CustomerOrderQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const customer_order_orm_entity_1 = require("../entities/customer-order.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const base_query_enum_1 = require("../../../common/base/enums/base.query.enum");
let CustomerOrderQueryRepository = class CustomerOrderQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('customerOrder')
            .leftJoinAndSelect('customerOrder.order', 'ord')
            .leftJoinAndSelect('ord.exchangeRateBuy', 'exchangeRateBuy')
            .leftJoinAndSelect('ord.exchangeRateSell', 'exchangeRateSell')
            .leftJoinAndSelect('customerOrder.notification', 'notification')
            .leftJoinAndSelect('customerOrder.customer', 'customer')
            .leftJoinAndSelect('customerOrder.customerOrderItems', 'customerOrderItems')
            .leftJoinAndSelect('customerOrderItems.orderItemSku', 'orderItemSku')
            .leftJoinAndSelect('orderItemSku.orderItem', 'orderItem')
            .leftJoinAndSelect('orderItemSku.exchangeRateBuy', 'skuExchangeRateBuy')
            .leftJoinAndSelect('orderItemSku.exchangeRateSell', 'skuExchangeRateSell');
        if (options.orderId != null) {
            qb.andWhere('ord.id = :orderId', { orderId: options.orderId });
        }
        if (options.customerOrderId != null) {
            qb.andWhere('customerOrder.id = :customerOrderId', { customerOrderId: options.customerOrderId });
        }
        if (options.customerId != null) {
            qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
        }
        if (options.merchantId != null) {
            qb.andWhere('ord.merchantId = :merchantId', { merchantId: options.merchantId });
        }
        if (options.customerToken) {
            qb.andWhere('customer.uniqueToken = :customerToken', { customerToken: options.customerToken });
        }
        if (options.notificationToken) {
            qb.andWhere('notification.uniqueToken = :notificationToken', { notificationToken: options.notificationToken });
        }
        if (options.notificationStatus) {
            if (options.notificationStatus === 'null') {
                qb.andWhere('customerOrder.notification_id IS NULL');
            }
            else {
                qb.andWhere('customerOrder.notification_id = :notificationStatus', {
                    notificationStatus: options.notificationStatus,
                });
            }
        }
        else if (!options.notificationToken) {
            qb.andWhere('customerOrder.notification_id IS NULL');
        }
        if (options.customerName) {
            qb.andWhere('customer.customerName LIKE :customerName', { customerName: `%${options.customerName}%` });
        }
        if (options.isArrived !== undefined) {
            if (options.isArrived) {
                qb.andWhere('ord.arrivedAt IS NOT NULL');
            }
            else {
                qb.andWhere('ord.arrivedAt IS NULL');
            }
        }
        if (options.startDate) {
            qb.andWhere('customerOrder.createdAt >= :startDate', { startDate: new Date(options.startDate) });
        }
        if (options.endDate) {
            qb.andWhere('customerOrder.createdAt <= :endDate', { endDate: new Date(options.endDate) });
        }
        if (options.paymentStatus) {
            qb.andWhere('customerOrder.paymentStatus = :paymentStatus', { paymentStatus: options.paymentStatus });
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            search: options.search ? { kw: options.search, field: options.searchField ?? 'customerOrder.id' } : undefined,
            sort: options.sort ?? base_query_enum_1.SortDirection.DESC,
            manager: manager,
        });
    }
};
exports.CustomerOrderQueryRepository = CustomerOrderQueryRepository;
exports.CustomerOrderQueryRepository = CustomerOrderQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_order_orm_entity_1.CustomerOrderOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerOrderQueryRepository);
//# sourceMappingURL=customer-order.query-repository.js.map