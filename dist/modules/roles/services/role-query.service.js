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
exports.RoleQueryService = void 0;
const common_1 = require("@nestjs/common");
const role_query_repository_1 = require("../repositories/role.query-repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
let RoleQueryService = class RoleQueryService {
    roleQueryRepository;
    transactionService;
    constructor(roleQueryRepository, transactionService) {
        this.roleQueryRepository = roleQueryRepository;
        this.transactionService = transactionService;
    }
    async getById(id) {
        const entity = await this.roleQueryRepository.repository.findOne({
            where: { id },
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Role not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query) {
        return await this.transactionService.run(async (manager) => {
            const result = await this.roleQueryRepository.findWithPagination({
                page: query.page,
                limit: query.limit,
            }, manager);
            return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
        });
    }
    toResponse(entity) {
        return {
            id: entity.id,
            roleName: entity.roleName,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.RoleQueryService = RoleQueryService;
exports.RoleQueryService = RoleQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_query_repository_1.RoleQueryRepository,
        transaction_service_1.TransactionService])
], RoleQueryService);
//# sourceMappingURL=role-query.service.js.map