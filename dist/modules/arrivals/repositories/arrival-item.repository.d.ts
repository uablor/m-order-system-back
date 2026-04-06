import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';
export declare class ArrivalItemRepository extends BaseRepository<ArrivalItemOrmEntity> {
    constructor(repository: Repository<ArrivalItemOrmEntity>);
}
