import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { CustomerOrderListQueryDto } from '../dto/customer-order-list-query.dto';
import { ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
export declare class CustomerOrderQueryRepository extends BaseQueryRepository<CustomerOrderOrmEntity> {
    constructor(repository: Repository<CustomerOrderOrmEntity>);
    findWithPagination(options: CustomerOrderListQueryDto, manager?: import('typeorm').EntityManager): Promise<ResponseWithPaginationInterface<CustomerOrderOrmEntity>>;
}
