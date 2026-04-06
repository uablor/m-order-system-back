import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
export declare class CustomerOrderItemQueryRepository extends BaseQueryRepository<CustomerOrderItemOrmEntity> {
    constructor(repository: Repository<CustomerOrderItemOrmEntity>);
    findWithPagination(options: {
        page?: number;
        limit?: number;
        customerOrderId?: number;
        orderItemSkuId?: number;
    }, manager?: import('typeorm').EntityManager): Promise<PaginatedResult<CustomerOrderItemOrmEntity>>;
}
