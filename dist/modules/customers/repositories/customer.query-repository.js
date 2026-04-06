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
exports.CustomerQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const customer_orm_entity_1 = require("../entities/customer.orm-entity");
let CustomerQueryRepository = class CustomerQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findOneByIdWithMerchant(id, currentUser, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.merchant', 'merchant');
        if (currentUser.merchantId) {
            qb.andWhere('merchant.id = :merchantId', { merchantId: currentUser.merchantId });
        }
        return qb.andWhere('customer.id = :id', { id }).getOne();
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(100, Math.max(1, options.limit ?? 10));
        const skip = (page - 1) * limit;
        const search = options.search?.trim();
        const qb = repo.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.merchant', 'merchant')
            .orderBy('customer.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        if (options.merchantId != null) {
            qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
        }
        if (search) {
            qb.andWhere('(customer.customerName LIKE :s OR customer.contactPhone LIKE :s OR customer.uniqueToken LIKE :s)', { s: `%${search}%` });
        }
        if (options.customerType != null) {
            qb.andWhere('customer.customerType = :customerType', { customerType: options.customerType });
        }
        if (options.isActive != null) {
            qb.andWhere('customer.isActive = :isActive', { isActive: options.isActive });
        }
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
        return { success: true, Code: 200, message: 'Customers fetched successfully', results: data, pagination };
    }
    async getSummary(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('customer')
            .leftJoin('customer.merchant', 'merchant')
            .select('COUNT(customer.id)', 'totalCustomers')
            .addSelect(`SUM(CASE WHEN customer.isActive = true THEN 1 ELSE 0 END)`, 'totalActive')
            .addSelect(`SUM(CASE WHEN customer.isActive = false THEN 1 ELSE 0 END)`, 'totalInactive');
        if (options.merchantId != null) {
            qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
        }
        if (options.search?.trim()) {
            const s = `%${options.search.trim()}%`;
            qb.andWhere('(customer.customerName LIKE :s OR customer.contactPhone LIKE :s)', { s });
        }
        const raw = await qb.getRawOne();
        return {
            totalCustomers: Number(raw?.totalCustomers ?? 0),
            totalActive: Number(raw?.totalActive ?? 0),
            totalInactive: Number(raw?.totalInactive ?? 0),
        };
    }
};
exports.CustomerQueryRepository = CustomerQueryRepository;
exports.CustomerQueryRepository = CustomerQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_orm_entity_1.CustomerOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerQueryRepository);
//# sourceMappingURL=customer.query-repository.js.map