import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { RoleOrmEntity } from '../entities/role.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
export declare class RoleQueryRepository extends BaseQueryRepository<RoleOrmEntity> {
    constructor(repository: Repository<RoleOrmEntity>);
    findWithPagination(options: {
        page?: number;
        limit?: number;
    }, manager: import('typeorm').EntityManager): Promise<PaginatedResult<RoleOrmEntity>>;
}
