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
exports.ExchangeRateQueryService = void 0;
const common_1 = require("@nestjs/common");
const exchange_rate_query_repository_1 = require("../repositories/exchange-rate.query-repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
let ExchangeRateQueryService = class ExchangeRateQueryService {
    exchangeRateQueryRepository;
    transactionService;
    constructor(exchangeRateQueryRepository, transactionService) {
        this.exchangeRateQueryRepository = exchangeRateQueryRepository;
        this.transactionService = transactionService;
    }
    async getById(id) {
        const entity = await this.exchangeRateQueryRepository.repository.findOne({
            where: { id },
            relations: ['merchant', 'createdByUser'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Exchange rate not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query, currentUser) {
        return this.transactionService.run(async (manager) => {
            const result = await this.exchangeRateQueryRepository.findWithPagination({
                page: query.page,
                limit: query.limit,
                merchantId: currentUser?.merchantId
                    ? currentUser.merchantId
                    : query.merchantId,
                rateType: query.rateType,
                baseCurrency: query.baseCurrency,
                targetCurrency: query.targetCurrency,
                isActive: query.isActive,
                search: query.search,
                searchField: query.searchField,
                sort: query.sort,
            }, manager);
            return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
        });
    }
    async getTodayRates(currentUser) {
        if (!currentUser?.merchantId) {
            throw new common_1.ForbiddenException('Merchant context required');
        }
        const { buy, sell } = await this.exchangeRateQueryRepository.findTodayRates(currentUser.merchantId);
        const results = [];
        if (buy)
            results.push(this.toResponse(buy));
        if (sell)
            results.push(this.toResponse(sell));
        return (0, response_helper_1.createResponse)(results, 'Success');
    }
    toResponse(entity) {
        const rateDate = entity.rateDate instanceof Date
            ? entity.rateDate.toISOString().slice(0, 10)
            : String(entity.rateDate);
        return {
            id: entity.id,
            merchantId: entity.merchant?.id ?? 0,
            baseCurrency: entity.baseCurrency,
            targetCurrency: entity.targetCurrency,
            rateType: entity.rateType,
            rate: entity.rate.toString(),
            isActive: entity.isActive,
            rateDate,
            createdBy: entity.createdByUser?.id ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.ExchangeRateQueryService = ExchangeRateQueryService;
exports.ExchangeRateQueryService = ExchangeRateQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [exchange_rate_query_repository_1.ExchangeRateQueryRepository,
        transaction_service_1.TransactionService])
], ExchangeRateQueryService);
//# sourceMappingURL=exchange-rate-query.service.js.map