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
exports.PaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_orm_entity_1 = require("../entities/payment.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
let PaymentRepository = class PaymentRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(data, manager) {
        const repo = manager ? manager.getRepository(payment_orm_entity_1.PaymentOrmEntity) : this.repository;
        const payment = repo.create(data);
        return repo.save(payment);
    }
    async findOneBy(conditions, manager) {
        const repo = manager ? manager.getRepository(payment_orm_entity_1.PaymentOrmEntity) : this.repository;
        return repo.findOne({ where: conditions, relations: ['customerOrder'] });
    }
    async findById(id, relations = []) {
        return this.repository.findOne({
            where: { id },
            relations,
        });
    }
    async findByMerchant(merchantId, query, manager) {
        const { page = 1, limit = 10, status, customerOrderId, customerId, paymentDateFrom, paymentDateTo, search, searchField, sort, readAt } = query;
        const repo = manager ? manager.getRepository(payment_orm_entity_1.PaymentOrmEntity) : this.repository;
        const qb = repo.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.customerOrder', 'customerOrder')
            .leftJoinAndSelect('customerOrder.order', 'order')
            .leftJoinAndSelect('customerOrder.customer', 'customer')
            .leftJoinAndSelect('order.merchant', 'merchant')
            .leftJoinAndSelect('payment.paymentProofImage', 'paymentProofImage');
        if (merchantId > 0) {
            qb.where('merchant.id = :merchantId', { merchantId });
        }
        if (status)
            qb.andWhere('payment.status = :status', { status });
        if (customerOrderId)
            qb.andWhere('payment.customerOrderId = :customerOrderId', { customerOrderId });
        if (customerId)
            qb.andWhere('customerOrder.customerId = :customerId', { customerId });
        if (paymentDateFrom)
            qb.andWhere('payment.paymentDate >= :paymentDateFrom', { paymentDateFrom });
        if (paymentDateTo)
            qb.andWhere('payment.paymentDate <= :paymentDateTo', { paymentDateTo });
        if (readAt === null)
            qb.andWhere('payment.readAt IS NULL');
        if (readAt !== null && readAt !== undefined)
            qb.andWhere('payment.readAt = :readAt', { readAt });
        if (search) {
            qb.andWhere('(customer.customerName LIKE :search OR order.orderCode LIKE :search)', { search: `%${search}%` });
        }
        const result = await (0, pagination_util_1.fetchWithPagination)({
            qb,
            sort: sort,
            page,
            limit,
            manager: manager || repo.manager,
        });
        return result;
    }
    async findByCustomer(customerId, query, manager) {
        const { page = 1, limit = 10, status, paymentDateFrom, paymentDateTo, search, searchField, sort } = query;
        const repo = manager ? manager.getRepository(payment_orm_entity_1.PaymentOrmEntity) : this.repository;
        const qb = repo.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.customerOrder', 'customerOrder')
            .leftJoinAndSelect('customerOrder.order', 'order')
            .leftJoinAndSelect('customerOrder.customer', 'customer')
            .leftJoinAndSelect('payment.paymentProofImage', 'paymentProofImage')
            .where('customerOrder.customerId = :customerId', { customerId });
        if (status)
            qb.andWhere('payment.status = :status', { status });
        if (paymentDateFrom)
            qb.andWhere('payment.paymentDate >= :paymentDateFrom', { paymentDateFrom });
        if (paymentDateTo)
            qb.andWhere('payment.paymentDate <= :paymentDateTo', { paymentDateTo });
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            sort: sort,
            search: search && searchField ? { kw: search, field: `payment.${searchField}` } : undefined,
            page,
            limit,
            manager: manager || repo.manager,
        });
    }
    async update(id, data, manager) {
        const repo = manager ? manager.getRepository(payment_orm_entity_1.PaymentOrmEntity) : this.repository;
        await repo.update(id, data);
        const updated = manager
            ? await repo.findOne({ where: { id } })
            : await this.repository.findOne({ where: { id } });
        if (!updated) {
            throw new Error(`Payment with id ${id} not found`);
        }
        return updated;
    }
    async delete(id, manager) {
        const repo = manager ? manager.getRepository(payment_orm_entity_1.PaymentOrmEntity) : this.repository;
        await repo.delete(id);
    }
    async getSummaryByMerchant(merchantId, query, manager) {
        const repo = manager ? manager.getRepository(payment_orm_entity_1.PaymentOrmEntity) : this.repository;
        const qb = repo.createQueryBuilder('payment')
            .leftJoin('payment.customerOrder', 'customerOrder')
            .leftJoin('customerOrder.order', 'order')
            .leftJoin('customerOrder.customer', 'customer')
            .leftJoin('order.merchant', 'merchant');
        if (merchantId > 0) {
            qb.where('merchant.id = :merchantId', { merchantId });
        }
        const { status, search, paymentDateFrom, paymentDateTo } = query;
        if (status)
            qb.andWhere('payment.status = :status', { status });
        if (paymentDateFrom)
            qb.andWhere('payment.paymentDate >= :paymentDateFrom', { paymentDateFrom });
        if (paymentDateTo)
            qb.andWhere('payment.paymentDate <= :paymentDateTo', { paymentDateTo });
        if (search) {
            qb.andWhere('(customer.customerName LIKE :search OR order.orderCode LIKE :search)', { search: `%${search}%` });
        }
        qb.select('COUNT(payment.id)', 'totalPayments')
            .addSelect('COALESCE(SUM(payment.paymentAmount), 0)', 'totalAmount')
            .addSelect(`SUM(CASE WHEN payment.status = 'PENDING' THEN 1 ELSE 0 END)`, 'totalPending')
            .addSelect(`SUM(CASE WHEN payment.status = 'VERIFIED' THEN 1 ELSE 0 END)`, 'totalVerified')
            .addSelect(`SUM(CASE WHEN payment.status = 'REJECTED' THEN 1 ELSE 0 END)`, 'totalRejected');
        const raw = await qb.getRawOne();
        return {
            totalPayments: Number(raw?.totalPayments ?? 0),
            totalAmount: raw?.totalAmount ?? '0',
            totalPending: Number(raw?.totalPending ?? 0),
            totalVerified: Number(raw?.totalVerified ?? 0),
            totalRejected: Number(raw?.totalRejected ?? 0),
        };
    }
    async findByCustomerOrderId(customerOrderId, relations = []) {
        return this.repository.findOne({
            where: { customerOrderId },
            relations: ['paymentProofImage', ...relations],
        });
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_orm_entity_1.PaymentOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentRepository);
//# sourceMappingURL=payment.repository.js.map