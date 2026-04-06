import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { ExchangeRateListQueryOptions } from '../dto/exchange-rate-list-query.dto';
export declare class ExchangeRateQueryRepository extends BaseQueryRepository<ExchangeRateOrmEntity> {
    constructor(repository: Repository<ExchangeRateOrmEntity>);
    findWithPagination(options: ExchangeRateListQueryOptions, manager: import('typeorm').EntityManager): Promise<PaginatedResult<ExchangeRateOrmEntity>>;
    findTodayRates(merchantId: number): Promise<{
        buy: ExchangeRateOrmEntity | null;
        sell: ExchangeRateOrmEntity | null;
    }>;
    getRateForDate(merchantId: number, rateDate: Date, baseCurrency: string, targetCurrency: string, rateType: 'BUY' | 'SELL'): Promise<ExchangeRateOrmEntity | null>;
}
