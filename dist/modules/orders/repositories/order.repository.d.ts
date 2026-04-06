import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { OrderOrmEntity } from '../entities/order.orm-entity';
export declare class OrderRepository extends BaseRepository<OrderOrmEntity> {
    constructor(repository: Repository<OrderOrmEntity>);
}
