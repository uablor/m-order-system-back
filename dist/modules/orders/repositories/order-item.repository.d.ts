import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';
export declare class OrderItemRepository extends BaseRepository<OrderItemOrmEntity> {
    constructor(repository: Repository<OrderItemOrmEntity>);
}
