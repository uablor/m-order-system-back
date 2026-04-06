import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
export declare class CustomerOrderItemRepository extends BaseRepository<CustomerOrderItemOrmEntity> {
    constructor(repository: Repository<CustomerOrderItemOrmEntity>);
}
