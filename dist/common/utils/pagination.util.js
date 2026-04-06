"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithPagination = fetchWithPagination;
async function fetchWithPagination(query) {
    if (query.search && query.search.kw && query.search.field) {
        query.qb.andWhere(`${query.qb.alias}.${query.search.field} LIKE :kw`, {
            kw: `%${query.search.kw}%`,
        });
    }
    query.qb.orderBy(`${query.qb.alias}.createdAt`, query.sort || 'DESC');
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;
    const [entities, total] = await query.qb
        .skip(skip)
        .take(limit)
        .getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    const pagination = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
    return {
        success: true,
        Code: 200,
        message: 'Fetched successfully',
        results: entities,
        pagination,
    };
}
//# sourceMappingURL=pagination.util.js.map