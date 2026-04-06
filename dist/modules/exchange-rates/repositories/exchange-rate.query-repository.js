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
exports.ExchangeRateQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const exchange_rate_orm_entity_1 = require("../entities/exchange-rate.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
let ExchangeRateQueryRepository = class ExchangeRateQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('er');
        if (options.merchantId) {
            qb.innerJoin('er.merchant', 'm').andWhere('m.id = :merchantId', {
                merchantId: options.merchantId,
            });
        }
        if (options.rateType) {
            qb.andWhere('er.rateType = :rateType', {
                rateType: options.rateType,
            });
        }
        if (options.baseCurrency) {
            qb.andWhere('er.baseCurrency = :baseCurrency', {
                baseCurrency: options.baseCurrency,
            });
        }
        if (options.targetCurrency) {
            qb.andWhere('er.targetCurrency = :targetCurrency', {
                targetCurrency: options.targetCurrency,
            });
        }
        if (options.isActive !== undefined) {
            qb.andWhere('er.isActive = :isActive', { isActive: options.isActive });
        }
        if (options.startDate) {
            qb.andWhere('er.rateDate >= :startDate', {
                startDate: options.startDate,
            });
        }
        if (options.endDate) {
            qb.andWhere('er.rateDate <= :endDate', {
                endDate: options.endDate,
            });
        }
        let searchField = options.searchField;
        if (options.search && !searchField) {
            searchField = 'baseCurrency';
        }
        const searchFieldMapping = {
            baseCurrency: 'baseCurrency',
            targetCurrency: 'targetCurrency',
            rateType: 'rateType',
            rate: 'rate',
        };
        const actualSearchField = searchFieldMapping[searchField || ''] || 'baseCurrency';
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            sort: options.sort,
            search: options.search
                ? {
                    kw: options.search,
                    field: actualSearchField
                }
                : undefined,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            manager: repo.manager,
        });
    }
    async findTodayRates(merchantId) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        const rows = await this.repository
            .createQueryBuilder('er')
            .innerJoinAndSelect('er.merchant', 'm')
            .leftJoinAndSelect('er.createdByUser', 'u')
            .where('m.id = :merchantId', { merchantId })
            .andWhere('DATE(er.rate_date) = :today', { today: todayStr })
            .andWhere('er.is_active = :active', { active: true })
            .orderBy('er.id', 'DESC')
            .getMany();
        const buy = rows.find((r) => r.rateType === 'BUY') ?? null;
        const sell = rows.find((r) => r.rateType === 'SELL') ?? null;
        return { buy, sell };
    }
    async getRateForDate(merchantId, rateDate, baseCurrency, targetCurrency, rateType) {
        const qb = this.repository
            .createQueryBuilder('er')
            .innerJoin('er.merchant', 'm')
            .where('m.id = :merchantId', { merchantId })
            .andWhere('er.rateDate <= :rateDate', { rateDate })
            .andWhere('er.baseCurrency = :baseCurrency', { baseCurrency })
            .andWhere('er.targetCurrency = :targetCurrency', { targetCurrency })
            .andWhere('er.rateType = :rateType', { rateType })
            .andWhere('er.isActive = :active', { active: true })
            .orderBy('er.rateDate', 'DESC')
            .take(1);
        return qb.getOne();
    }
};
exports.ExchangeRateQueryRepository = ExchangeRateQueryRepository;
exports.ExchangeRateQueryRepository = ExchangeRateQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exchange_rate_orm_entity_1.ExchangeRateOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExchangeRateQueryRepository);
//# sourceMappingURL=exchange-rate.query-repository.js.map