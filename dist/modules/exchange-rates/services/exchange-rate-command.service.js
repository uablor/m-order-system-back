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
exports.ExchangeRateCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const exchange_rate_repository_1 = require("../repositories/exchange-rate.repository");
const merchant_repository_1 = require("../../merchants/repositories/merchant.repository");
const cache_manager_1 = require("@nestjs/cache-manager");
let ExchangeRateCommandService = class ExchangeRateCommandService {
    transactionService;
    exchangeRateRepository;
    merchantRepository;
    cacheManager;
    constructor(transactionService, exchangeRateRepository, merchantRepository, cacheManager) {
        this.transactionService = transactionService;
        this.exchangeRateRepository = exchangeRateRepository;
        this.merchantRepository = merchantRepository;
        this.cacheManager = cacheManager;
    }
    async create(dto, currentUser) {
        if (!currentUser?.merchantId) {
            throw new common_1.ForbiddenException('Merchant context required for this action');
        }
        return this.transactionService.run(async (manager) => {
            const merchant = await this.merchantRepository.findOneById(currentUser.merchantId, manager);
            if (!merchant)
                throw new common_1.NotFoundException('Merchant not found');
            const rateDate = new Date();
            await this.exchangeRateRepository.getRepo(manager).update({
                merchant: { id: currentUser.merchantId },
                rateType: dto.rateType,
                isActive: true,
            }, { isActive: false });
            const entity = await this.exchangeRateRepository.create({
                merchant,
                baseCurrency: dto.baseCurrency,
                targetCurrency: dto.targetCurrency,
                rateType: dto.rateType,
                rate: dto.rate,
                isActive: true,
                rateDate,
                createdByUser: { id: currentUser.userId },
            }, manager);
            console.log('entity', entity);
            await this.clearExchangeRateCache();
            return { id: entity.id };
        });
    }
    async createMany(dto, currentUser) {
        if (!currentUser?.merchantId) {
            throw new common_1.ForbiddenException('Merchant context required for this action');
        }
        return this.transactionService.run(async (manager) => {
            const merchant = await this.merchantRepository.findOneById(currentUser.merchantId, manager);
            if (!merchant)
                throw new common_1.NotFoundException('Merchant not found');
            const rateDate = new Date();
            const ids = [];
            for (const item of dto.items) {
                await this.exchangeRateRepository.getRepo(manager).update({
                    merchant: { id: currentUser.merchantId },
                    rateType: item.rateType,
                    isActive: true,
                }, { isActive: false });
                const entity = await this.exchangeRateRepository.create({
                    merchant,
                    baseCurrency: item.baseCurrency,
                    targetCurrency: item.targetCurrency,
                    rateType: item.rateType,
                    rate: item.rate,
                    isActive: true,
                    rateDate,
                    createdByUser: { id: currentUser.userId },
                }, manager);
                ids.push(entity.id);
            }
            await this.clearExchangeRateCache();
            return { ids };
        });
    }
    async update(id, dto, currentUser) {
        await this.transactionService.run(async (manager) => {
            if (currentUser) {
                const existing = await this.exchangeRateRepository.findOneById(id, manager);
                if (!existing)
                    throw new common_1.NotFoundException('Exchange rate not found');
            }
            else {
                const existing = await this.exchangeRateRepository.findOneById(id, manager);
                if (!existing)
                    throw new common_1.NotFoundException('Exchange rate not found');
            }
            const updateData = {};
            if (dto.baseCurrency !== undefined)
                updateData.baseCurrency = dto.baseCurrency;
            if (dto.targetCurrency !== undefined)
                updateData.targetCurrency = dto.targetCurrency;
            if (dto.rateType !== undefined)
                updateData.rateType = dto.rateType;
            if (dto.rate !== undefined)
                updateData.rate = dto.rate;
            if (dto.rateDate !== undefined)
                updateData.rateDate = new Date(dto.rateDate);
            if (dto.isActive !== undefined)
                updateData.isActive = dto.isActive;
            await this.clearExchangeRateCache();
            await this.exchangeRateRepository.update(id, updateData, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.exchangeRateRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Exchange rate not found');
            await this.clearExchangeRateCache();
            await this.exchangeRateRepository.delete(id, manager);
        });
    }
    async clearExchangeRateCache() {
        const store = this.cacheManager.store;
        if (store?.keys) {
            const keys = await store.keys();
            const exchangeKeys = keys.filter((k) => k.includes('/exchange-rate'));
            await Promise.all(exchangeKeys.map((k) => this.cacheManager.del(k)));
        }
    }
};
exports.ExchangeRateCommandService = ExchangeRateCommandService;
exports.ExchangeRateCommandService = ExchangeRateCommandService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        exchange_rate_repository_1.ExchangeRateRepository,
        merchant_repository_1.MerchantRepository,
        cache_manager_1.Cache])
], ExchangeRateCommandService);
//# sourceMappingURL=exchange-rate-command.service.js.map