import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { UserListQueryOptions } from '../dto/user-list-query.dto';
export declare class UserQueryRepository extends BaseQueryRepository<UserOrmEntity> {
    constructor(repository: Repository<UserOrmEntity>);
    findWithPagination(options: UserListQueryOptions, manager: import('typeorm').EntityManager): Promise<PaginatedResult<UserOrmEntity>>;
    getSummary(options: {
        merchantId?: number;
        isActive?: boolean;
        search?: string;
        startDate?: string;
        endDate?: string;
    }, manager: import('typeorm').EntityManager): Promise<{
        totalUsers: number;
        totalActive: number;
        totalInactive: number;
    }>;
}
