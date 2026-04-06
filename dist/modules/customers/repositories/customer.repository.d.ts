import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
export declare class CustomerRepository extends BaseRepository<CustomerOrmEntity> {
    constructor(repository: Repository<CustomerOrmEntity>);
}
