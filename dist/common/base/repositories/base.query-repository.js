"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQueryRepository = void 0;
const pagination_util_1 = require("../../utils/pagination.util");
class BaseQueryRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getRepo(manager) {
        return manager
            ? manager.getRepository(this.repository.target)
            : this.repository;
    }
    async findWithPagination(options, manager, relations) {
        const repo = this.getRepo(manager);
        const qb = repo.createQueryBuilder('entity');
        if (relations?.length) {
            relations.forEach((relation) => {
                qb.leftJoinAndSelect(`entity.${relation}`, relation);
            });
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            sort: options.sort,
            search: options.search
                ? { kw: options.search, field: options.searchField || 'name' }
                : undefined,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            manager: repo.manager,
        });
    }
    async findMany(options, manager) {
        const repo = manager
            ? manager.getRepository(this.repository.target)
            : this.repository;
        return repo.find(options);
    }
}
exports.BaseQueryRepository = BaseQueryRepository;
//# sourceMappingURL=base.query-repository.js.map