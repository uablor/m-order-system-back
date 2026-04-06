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
exports.ArrivalItemQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const arrival_item_orm_entity_1 = require("../entities/arrival-item.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const base_query_enum_1 = require("../../../common/base/enums/base.query.enum");
let ArrivalItemQueryRepository = class ArrivalItemQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo
            .createQueryBuilder('arrivalItem')
            .leftJoinAndSelect('arrivalItem.arrival', 'arrival')
            .leftJoinAndSelect('arrivalItem.orderItem', 'orderItem');
        if (options.arrivalId != null) {
            qb.andWhere('arrival.id = :arrivalId', { arrivalId: options.arrivalId });
        }
        if (options.orderItemId != null) {
            qb.andWhere('orderItem.id = :orderItemId', { orderItemId: options.orderItemId });
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            search: { kw: options.search, field: options.searchField ?? 'id' },
            manager: manager || repo.manager,
            sort: options.sort ?? base_query_enum_1.SortDirection.ASC,
        });
    }
};
exports.ArrivalItemQueryRepository = ArrivalItemQueryRepository;
exports.ArrivalItemQueryRepository = ArrivalItemQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(arrival_item_orm_entity_1.ArrivalItemOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArrivalItemQueryRepository);
//# sourceMappingURL=arrival-item.query-repository.js.map