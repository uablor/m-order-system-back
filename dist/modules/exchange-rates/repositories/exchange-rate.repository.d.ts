import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';
export declare class ExchangeRateRepository extends BaseRepository<ExchangeRateOrmEntity> {
    constructor(repository: Repository<ExchangeRateOrmEntity>);
}
