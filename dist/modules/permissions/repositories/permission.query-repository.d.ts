import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
export declare class PermissionQueryRepository extends BaseQueryRepository<PermissionOrmEntity> {
    constructor(repository: Repository<PermissionOrmEntity>);
    findWithPagination(options: {
        page?: number;
        limit?: number;
    }, manager: import('typeorm').EntityManager): Promise<PaginatedResult<PermissionOrmEntity>>;
}
