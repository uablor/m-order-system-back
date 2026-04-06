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
exports.CustomerQueryService = void 0;
const common_1 = require("@nestjs/common");
const customer_query_repository_1 = require("../repositories/customer.query-repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let CustomerQueryService = class CustomerQueryService {
    customerQueryRepository;
    constructor(customerQueryRepository) {
        this.customerQueryRepository = customerQueryRepository;
    }
    async getById(id, auth, manager) {
        const entity = await this.customerQueryRepository.findOneByIdWithMerchant(id, auth, manager);
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id, auth, manager) {
        const dto = await this.getById(id, auth, manager);
        if (!dto)
            throw new common_1.NotFoundException('Customer not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query, currentUser) {
        const merchantId = currentUser?.merchantId ? currentUser.merchantId : query.merchantId;
        const result = await this.customerQueryRepository.findWithPagination({
            page: query.page,
            limit: query.limit,
            merchantId,
            search: query.search,
            customerType: query.customerType,
            isActive: query.isActive,
        });
        const summary = await this.customerQueryRepository.getSummary({
            merchantId,
            search: query.search,
        });
        const paginated = (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
        return { ...paginated, summary };
    }
    toResponse(entity) {
        return {
            id: entity.id,
            merchantId: entity.merchant?.id ?? 0,
            customerName: entity.customerName,
            customerType: entity.customerType,
            shippingAddress: entity.shippingAddress,
            shippingProvider: entity.shippingProvider,
            shippingSource: entity.shippingSource,
            shippingDestination: entity.shippingDestination,
            paymentTerms: entity.paymentTerms,
            contactPhone: entity.contactPhone,
            contactFacebook: entity.contactFacebook,
            contactWhatsapp: entity.contactWhatsapp,
            contactLine: entity.contactLine,
            preferredContactMethod: entity.preferredContactMethod,
            uniqueToken: entity.uniqueToken,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.CustomerQueryService = CustomerQueryService;
exports.CustomerQueryService = CustomerQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_query_repository_1.CustomerQueryRepository])
], CustomerQueryService);
//# sourceMappingURL=customer-query.service.js.map