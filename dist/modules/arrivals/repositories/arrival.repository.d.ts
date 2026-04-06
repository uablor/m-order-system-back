import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
export declare class ArrivalRepository extends BaseRepository<ArrivalOrmEntity> {
    constructor(repository: Repository<ArrivalOrmEntity>);
}
