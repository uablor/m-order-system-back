import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
export declare class CustomerOrderRepository extends BaseRepository<CustomerOrderOrmEntity> {
    constructor(repository: Repository<CustomerOrderOrmEntity>);
}
