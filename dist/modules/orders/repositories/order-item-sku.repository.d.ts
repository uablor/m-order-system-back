import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { OrderItemSkuOrmEntity } from '../entities/order-item-sku.orm-entity';
export declare class OrderItemSkuRepository extends BaseRepository<OrderItemSkuOrmEntity> {
    constructor(repository: Repository<OrderItemSkuOrmEntity>);
}
