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
exports.MerchantQueryService = void 0;
const common_1 = require("@nestjs/common");
const merchant_query_repository_1 = require("../repositories/merchant.query-repository");
const merchant_repository_1 = require("../repositories/merchant.repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
let MerchantQueryService = class MerchantQueryService {
    merchantRepository;
    merchantQueryRepository;
    transactionService;
    constructor(merchantRepository, merchantQueryRepository, transactionService) {
        this.merchantRepository = merchantRepository;
        this.merchantQueryRepository = merchantQueryRepository;
        this.transactionService = transactionService;
    }
    async getById(id) {
        const entity = await this.merchantRepository.findOneById(id);
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Merchant not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query) {
        return this.transactionService.run(async (manager) => {
            const result = await this.merchantQueryRepository.findWithPagination({
                page: query.page,
                limit: query.limit,
                search: query.search,
                searchField: query.searchField,
                sort: query.sort,
            }, manager);
            return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
        });
    }
    async findMerchantDetail(userId) {
        return this.transactionService.run(async (manager) => {
            const entity = await this.merchantQueryRepository.findMerchantDetail(userId, manager);
            if (!entity)
                throw new common_1.NotFoundException('Merchant not found');
            return (0, response_helper_1.createSingleResponse)(this.toResponse(entity));
        });
    }
    async getDetailById(id) {
        return this.transactionService.run(async (manager) => {
            const merchant = await this.merchantQueryRepository.findByIdWithOwner(id, manager);
            if (!merchant)
                throw new common_1.NotFoundException('Merchant not found');
            const [customers, financialRaw, currencyRows] = await Promise.all([
                this.merchantQueryRepository.findCustomersByMerchantId(id, manager),
                this.merchantQueryRepository.getFinancialSummaryByMerchantId(id, manager),
                this.merchantQueryRepository.getFinancialByCurrency(id, manager),
            ]);
            const activeCustomers = customers.filter((c) => c.isActive).length;
            const byCurrency = currencyRows.map((r) => ({
                baseCurrency: r.baseCurrency,
                totalOrders: r.totalOrders,
                totalIncomeLak: r.totalIncomeLak,
                totalExpenseLak: r.totalExpenseLak,
                totalProfitLak: r.totalProfitLak,
            }));
            const financial = {
                totalOrders: financialRaw.totalOrders,
                ordersUnpaid: financialRaw.ordersUnpaid,
                ordersPartial: financialRaw.ordersPartial,
                ordersPaid: financialRaw.ordersPaid,
                totalIncomeLak: financialRaw.totalIncomeLak,
                totalIncomeThb: 0,
                totalExpenseLak: financialRaw.totalExpenseLak,
                totalExpenseThb: 0,
                totalProfitLak: financialRaw.totalProfitLak,
                totalProfitThb: 0,
                totalPaidAmount: financialRaw.totalPaidAmount,
                totalRemainingAmount: financialRaw.totalRemainingAmount,
                byCurrency,
            };
            const summary = {
                totalCustomers: customers.length,
                activeCustomers,
                inactiveCustomers: customers.length - activeCustomers,
                customerTypeCustomer: customers.filter((c) => c.customerType === 'CUSTOMER').length,
                customerTypeAgent: customers.filter((c) => c.customerType === 'AGENT').length,
                financial,
            };
            const ownerDto = merchant.ownerUser
                ? {
                    id: merchant.ownerUser.id,
                    email: merchant.ownerUser.email,
                    fullName: merchant.ownerUser.fullName,
                    roleId: merchant.ownerUser.roleId,
                    roleName: merchant.ownerUser.role?.roleName,
                    isActive: merchant.ownerUser.isActive,
                    createdAt: merchant.ownerUser.createdAt,
                    lastLogin: merchant.ownerUser.lastLogin,
                }
                : null;
            const detail = {
                id: merchant.id,
                ownerUserId: merchant.ownerUserId,
                shopName: merchant.shopName,
                shopLogoUrl: merchant.shopLogoUrl,
                shopAddress: merchant.shopAddress,
                contactPhone: merchant.contactPhone,
                contactEmail: merchant.contactEmail,
                contactFacebook: merchant.contactFacebook,
                contactLine: merchant.contactLine,
                contactWhatsapp: merchant.contactWhatsapp,
                defaultCurrency: merchant.defaultCurrency,
                isActive: merchant.isActive,
                createdAt: merchant.createdAt,
                updatedAt: merchant.updatedAt,
                owner: ownerDto,
                summary,
            };
            return (0, response_helper_1.createSingleResponse)(detail);
        });
    }
    toResponse(entity) {
        return {
            id: entity.id,
            ownerUserId: entity.ownerUserId,
            shopName: entity.shopName,
            shopLogoUrl: entity.shopLogoUrl
                ? {
                    id: entity.shopLogoUrl.id,
                    fileKey: entity.shopLogoUrl.fileKey,
                    originalName: entity.shopLogoUrl.originalName,
                    publicUrl: entity.shopLogoUrl.publicUrl || `${process.env.R2_PUBLIC_URL}/${entity.shopLogoUrl.fileKey}`,
                }
                : null,
            shopAddress: entity.shopAddress,
            contactPhone: entity.contactPhone,
            contactEmail: entity.contactEmail,
            contactFacebook: entity.contactFacebook,
            contactLine: entity.contactLine,
            contactWhatsapp: entity.contactWhatsapp,
            defaultCurrency: entity.defaultCurrency,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.MerchantQueryService = MerchantQueryService;
exports.MerchantQueryService = MerchantQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [merchant_repository_1.MerchantRepository,
        merchant_query_repository_1.MerchantQueryRepository,
        transaction_service_1.TransactionService])
], MerchantQueryService);
//# sourceMappingURL=merchant-query.service.js.map