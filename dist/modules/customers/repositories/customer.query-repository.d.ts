import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class CustomerQueryRepository extends BaseQueryRepository<CustomerOrmEntity> {
    constructor(repository: Repository<CustomerOrmEntity>);
    findOneByIdWithMerchant(id: number, currentUser: CurrentUserPayload, manager?: import('typeorm').EntityManager): Promise<CustomerOrmEntity | null>;
    findWithPagination(options: {
        page?: number;
        limit?: number;
        merchantId?: number;
        search?: string;
        customerType?: 'CUSTOMER' | 'AGENT';
        isActive?: boolean;
    }, manager?: import('typeorm').EntityManager): Promise<PaginatedResult<CustomerOrmEntity>>;
    getSummary(options: {
        merchantId?: number;
        search?: string;
    }, manager?: import('typeorm').EntityManager): Promise<{
        totalCustomers: number;
        totalActive: number;
        totalInactive: number;
    }>;
}
