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
exports.UserQueryService = void 0;
const common_1 = require("@nestjs/common");
const user_query_repository_1 = require("../repositories/user.query-repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
let UserQueryService = class UserQueryService {
    userQueryRepository;
    transactionService;
    constructor(userQueryRepository, transactionService) {
        this.userQueryRepository = userQueryRepository;
        this.transactionService = transactionService;
    }
    async getById(id) {
        const entity = await this.userQueryRepository.repository.findOne({
            where: { id },
            relations: ['role', 'merchant'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('User not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query, merchantId) {
        return this.transactionService.run(async (manager) => {
            const result = await this.userQueryRepository.findWithPagination({
                merchantId,
                page: query.page,
                limit: query.limit,
                isActive: query.isActive,
                search: query.search,
                searchField: query.searchField,
                sort: query.sort,
                startDate: query.startDate,
                endDate: query.endDate,
            }, manager);
            return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
        });
    }
    async getSummary(query, merchantId) {
        return this.transactionService.run(async (manager) => {
            return this.userQueryRepository.getSummary({
                merchantId,
                isActive: query.isActive,
                search: query.search,
                startDate: query.startDate,
                endDate: query.endDate,
            }, manager);
        });
    }
    toResponse(entity) {
        const merchantId = entity.merchantId ?? entity.merchant?.id ?? null;
        return {
            id: entity.id,
            email: entity.email,
            fullName: entity.fullName,
            roleId: entity.roleId,
            roleName: entity.role?.roleName,
            merchantId,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            lastLogin: entity.lastLogin,
        };
    }
};
exports.UserQueryService = UserQueryService;
exports.UserQueryService = UserQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_query_repository_1.UserQueryRepository,
        transaction_service_1.TransactionService])
], UserQueryService);
//# sourceMappingURL=user-query.service.js.map