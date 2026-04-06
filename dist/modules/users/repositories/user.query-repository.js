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
exports.UserQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const user_orm_entity_1 = require("../entities/user.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
let UserQueryRepository = class UserQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('entity')
            .leftJoinAndSelect('entity.role', 'role')
            .andWhere('role.roleName != :superadmin', { superadmin: 'superadmin' });
        if (options.isActive !== undefined && options.isActive !== null) {
            qb.andWhere('entity.isActive = :isActive', {
                isActive: options.isActive,
            });
        }
        if (options.startDate) {
            qb.andWhere('entity.createdAt >= :startDate', {
                startDate: options.startDate,
            });
        }
        if (options.endDate) {
            qb.andWhere('entity.createdAt <= :endDate', { endDate: options.endDate });
        }
        if (options.merchantId) {
            qb.andWhere('entity.merchantId = :merchantId', {
                merchantId: options.merchantId,
            });
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            sort: options.sort,
            search: options.search
                ? { kw: options.search, field: options.searchField || 'fullName' }
                : undefined,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            manager: repo.manager,
        });
    }
    async getSummary(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('entity')
            .leftJoin('entity.role', 'role')
            .andWhere('role.roleName != :superadmin', { superadmin: 'superadmin' })
            .select('COUNT(entity.id)', 'totalUsers')
            .addSelect(`SUM(CASE WHEN entity.isActive = true THEN 1 ELSE 0 END)`, 'totalActive')
            .addSelect(`SUM(CASE WHEN entity.isActive = false THEN 1 ELSE 0 END)`, 'totalInactive');
        if (options.merchantId) {
            qb.andWhere('entity.merchantId = :merchantId', { merchantId: options.merchantId });
        }
        if (options.isActive !== undefined && options.isActive !== null) {
            qb.andWhere('entity.isActive = :isActive', { isActive: options.isActive });
        }
        if (options.search) {
            qb.andWhere('(entity.fullName ILIKE :search OR entity.email ILIKE :search)', {
                search: `%${options.search}%`,
            });
        }
        if (options.startDate) {
            qb.andWhere('entity.createdAt >= :startDate', { startDate: options.startDate });
        }
        if (options.endDate) {
            qb.andWhere('entity.createdAt <= :endDate', { endDate: options.endDate });
        }
        const raw = await qb.getRawOne();
        return {
            totalUsers: Number(raw?.totalUsers ?? 0),
            totalActive: Number(raw?.totalActive ?? 0),
            totalInactive: Number(raw?.totalInactive ?? 0),
        };
    }
};
exports.UserQueryRepository = UserQueryRepository;
exports.UserQueryRepository = UserQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_orm_entity_1.UserOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserQueryRepository);
//# sourceMappingURL=user.query-repository.js.map