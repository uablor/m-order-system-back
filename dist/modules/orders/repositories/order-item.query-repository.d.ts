import { Repository, EntityManager } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
export declare class OrderItemQueryRepository extends BaseQueryRepository<OrderItemOrmEntity> {
    constructor(repository: Repository<OrderItemOrmEntity>);
    findWithPagination(options: OrderItemListQueryDto, manager?: EntityManager): Promise<PaginatedResult<OrderItemOrmEntity>>;
}
