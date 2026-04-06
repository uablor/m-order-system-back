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
exports.ArrivalItemQueryService = void 0;
const common_1 = require("@nestjs/common");
const arrival_item_query_repository_1 = require("../repositories/arrival-item.query-repository");
const arrival_item_repository_1 = require("../repositories/arrival-item.repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let ArrivalItemQueryService = class ArrivalItemQueryService {
    arrivalItemRepository;
    arrivalItemQueryRepository;
    constructor(arrivalItemRepository, arrivalItemQueryRepository) {
        this.arrivalItemRepository = arrivalItemRepository;
        this.arrivalItemQueryRepository = arrivalItemQueryRepository;
    }
    async getById(id) {
        const entity = await this.arrivalItemQueryRepository.repository.findOne({
            where: { id },
            relations: ['arrival', 'orderItem'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Arrival item not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query) {
        const result = await this.arrivalItemQueryRepository.findWithPagination({
            page: query.page,
            limit: query.limit,
            arrivalId: query.arrivalId,
            orderItemId: query.orderItemId,
            createdByUserId: query.createdByUserId,
        });
        return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
    }
    toResponse(entity) {
        return {
            id: entity.id,
            arrivalId: entity.arrival?.id ?? 0,
            orderItemId: entity.orderItem?.id ?? 0,
            arrivedQuantity: entity.arrivedQuantity,
            condition: entity.condition ?? null,
            notes: entity.notes ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.ArrivalItemQueryService = ArrivalItemQueryService;
exports.ArrivalItemQueryService = ArrivalItemQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [arrival_item_repository_1.ArrivalItemRepository,
        arrival_item_query_repository_1.ArrivalItemQueryRepository])
], ArrivalItemQueryService);
//# sourceMappingURL=arrival-item-query.service.js.map