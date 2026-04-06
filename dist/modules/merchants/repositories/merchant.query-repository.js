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
exports.MerchantQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const merchant_orm_entity_1 = require("../entities/merchant.orm-entity");
const user_orm_entity_1 = require("../../users/entities/user.orm-entity");
const customer_orm_entity_1 = require("../../customers/entities/customer.orm-entity");
const order_orm_entity_1 = require("../../orders/entities/order.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
let MerchantQueryRepository = class MerchantQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('entity');
        if (options.ownerUserId != null) {
            qb.andWhere('entity.ownerUserId = :ownerUserId', {
                ownerUserId: options.ownerUserId,
            });
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            sort: options.sort,
            search: options.search?.trim()
                ? { kw: options.search.trim(), field: options.searchField || 'shopName' }
                : undefined,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            manager: repo.manager,
        });
    }
    async findMerchantDetail(ownerUserId, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('entity');
        qb.where('entity.ownerUserId = :ownerUserId', { ownerUserId });
        qb.leftJoinAndSelect('entity.ownerUser', 'ownerUser');
        return qb.getOne();
    }
    async findByIdWithOwner(id, manager) {
        const repo = this.getRepo(manager);
        return repo
            .createQueryBuilder('m')
            .leftJoinAndSelect('m.ownerUser', 'owner')
            .leftJoinAndSelect('owner.role', 'ownerRole')
            .where('m.id = :id', { id })
            .getOne();
    }
    async findUsersByMerchantId(merchantId, manager) {
        return manager
            .getRepository(user_orm_entity_1.UserOrmEntity)
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.role', 'role')
            .where('u.merchantId = :merchantId', { merchantId })
            .orderBy('u.createdAt', 'DESC')
            .getMany();
    }
    async findCustomersByMerchantId(merchantId, manager) {
        return manager
            .getRepository(customer_orm_entity_1.CustomerOrmEntity)
            .createQueryBuilder('c')
            .where('c.merchant_id = :merchantId', { merchantId })
            .orderBy('c.createdAt', 'DESC')
            .getMany();
    }
    async getFinancialSummaryByMerchantId(merchantId, manager) {
        const raw = await manager
            .getRepository(order_orm_entity_1.OrderOrmEntity)
            .createQueryBuilder('o')
            .select('COUNT(o.id)', 'totalOrders')
            .addSelect(`SUM(CASE WHEN o.payment_status = 'UNPAID' THEN 1 ELSE 0 END)`, 'ordersUnpaid')
            .addSelect(`SUM(CASE WHEN o.payment_status = 'PARTIAL' THEN 1 ELSE 0 END)`, 'ordersPartial')
            .addSelect(`SUM(CASE WHEN o.payment_status = 'PAID' THEN 1 ELSE 0 END)`, 'ordersPaid')
            .addSelect('COALESCE(SUM(o.total_selling_amount), 0)', 'totalIncomeLak')
            .addSelect('COALESCE(SUM(o.total_final_cost), 0)', 'totalExpenseLak')
            .addSelect('COALESCE(SUM(o.total_profit), 0)', 'totalProfitLak')
            .addSelect(`(SELECT COALESCE(SUM(co.total_paid), 0) FROM customer_orders co INNER JOIN orders o2 ON o2.id = co.order_id WHERE o2.merchant_id = :merchantId)`, 'totalPaidAmount')
            .addSelect(`(SELECT COALESCE(SUM(co.remaining_amount), 0) FROM customer_orders co INNER JOIN orders o2 ON o2.id = co.order_id WHERE o2.merchant_id = :merchantId)`, 'totalRemainingAmount')
            .where('o.merchant_id = :merchantId', { merchantId })
            .getRawOne();
        return {
            totalOrders: Number(raw?.totalOrders ?? 0),
            ordersUnpaid: Number(raw?.ordersUnpaid ?? 0),
            ordersPartial: Number(raw?.ordersPartial ?? 0),
            ordersPaid: Number(raw?.ordersPaid ?? 0),
            totalIncomeLak: Number(raw?.totalIncomeLak ?? 0),
            totalExpenseLak: Number(raw?.totalExpenseLak ?? 0),
            totalProfitLak: Number(raw?.totalProfitLak ?? 0),
            totalPaidAmount: Number(raw?.totalPaidAmount ?? 0),
            totalRemainingAmount: Number(raw?.totalRemainingAmount ?? 0),
        };
    }
    async getFinancialByCurrency(merchantId, manager) {
        const rows = await manager
            .getRepository(order_orm_entity_1.OrderOrmEntity)
            .createQueryBuilder('o')
            .select('COALESCE(er.base_currency, :unknown)', 'baseCurrency')
            .addSelect('COUNT(o.id)', 'totalOrders')
            .addSelect('COALESCE(SUM(o.total_selling_amount), 0)', 'totalIncomeLak')
            .addSelect('COALESCE(SUM(o.total_final_cost), 0)', 'totalExpenseLak')
            .addSelect('COALESCE(SUM(o.total_profit), 0)', 'totalProfitLak')
            .leftJoin('exchange_rates', 'er', 'er.id = o.exchange_rate_buy_id')
            .where('o.merchant_id = :merchantId', { merchantId })
            .setParameter('unknown', 'Unknown')
            .groupBy('er.base_currency')
            .orderBy('COUNT(o.id)', 'DESC')
            .getRawMany();
        return rows.map((r) => ({
            baseCurrency: r.baseCurrency ?? 'Unknown',
            totalOrders: Number(r.totalOrders ?? 0),
            totalIncomeLak: Number(r.totalIncomeLak ?? 0),
            totalExpenseLak: Number(r.totalExpenseLak ?? 0),
            totalProfitLak: Number(r.totalProfitLak ?? 0),
        }));
    }
};
exports.MerchantQueryRepository = MerchantQueryRepository;
exports.MerchantQueryRepository = MerchantQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(merchant_orm_entity_1.MerchantOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MerchantQueryRepository);
//# sourceMappingURL=merchant.query-repository.js.map