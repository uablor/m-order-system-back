import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { fetchWithPagination } from 'src/common/utils/pagination.util';
import { ExchangeRateListQueryOptions } from '../dto/exchange-rate-list-query.dto';

@Injectable()
export class ExchangeRateQueryRepository extends BaseQueryRepository<ExchangeRateOrmEntity> {
  constructor(
    @InjectRepository(ExchangeRateOrmEntity)
    repository: Repository<ExchangeRateOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: ExchangeRateListQueryOptions,
    manager: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ExchangeRateOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('er');

    if (options.merchantId) {
      qb.innerJoin('er.merchant', 'm').andWhere('m.id = :merchantId', {
        merchantId: options.merchantId,
      });
    }

    if (options.rateType) {
      qb.andWhere('er.rateType = :rateType', {
        rateType: options.rateType,
      });
    }

    if (options.baseCurrency) {
      qb.andWhere('er.baseCurrency = :baseCurrency', {
        baseCurrency: options.baseCurrency,
      });
    }

    if (options.targetCurrency) {
      qb.andWhere('er.targetCurrency = :targetCurrency', {
        targetCurrency: options.targetCurrency,
      });
    }

    if (options.isActive !== undefined) {
      qb.andWhere('er.isActive = :isActive', { isActive: options.isActive });
    }

    if (options.startDate) {
      qb.andWhere('er.rateDate >= :startDate', {
        startDate: options.startDate,
      });
    }

    if (options.endDate) {
      qb.andWhere('er.rateDate <= :endDate', {
        endDate: options.endDate,
      });
    }

    return fetchWithPagination<ExchangeRateOrmEntity>({
      qb,
      sort: options.sort,
      search: options.search
        ? { kw: options.search, field: options.searchField || 'name' }
        : undefined,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      manager: repo.manager,
    });
  }

  async findTodayRates(
    merchantId: number,
  ): Promise<{ buy: ExchangeRateOrmEntity | null; sell: ExchangeRateOrmEntity | null }> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const rows = await this.repository
      .createQueryBuilder('er')
      .innerJoinAndSelect('er.merchant', 'm')
      .leftJoinAndSelect('er.createdByUser', 'u')
      .where('m.id = :merchantId', { merchantId })
      .andWhere('DATE(er.rate_date) = :today', { today: todayStr })
      .andWhere('er.is_active = :active', { active: true })
      .orderBy('er.id', 'DESC')
      .getMany();

    const buy = rows.find((r) => r.rateType === 'BUY') ?? null;
    const sell = rows.find((r) => r.rateType === 'SELL') ?? null;
    return { buy, sell };
  }

  async getRateForDate(
    merchantId: number,
    rateDate: Date,
    baseCurrency: string,
    targetCurrency: string,
    rateType: 'BUY' | 'SELL',
  ): Promise<ExchangeRateOrmEntity | null> {
    const qb = this.repository
      .createQueryBuilder('er')
      .innerJoin('er.merchant', 'm')
      .where('m.id = :merchantId', { merchantId })
      .andWhere('er.rateDate <= :rateDate', { rateDate })
      .andWhere('er.baseCurrency = :baseCurrency', { baseCurrency })
      .andWhere('er.targetCurrency = :targetCurrency', { targetCurrency })
      .andWhere('er.rateType = :rateType', { rateType })
      .andWhere('er.isActive = :active', { active: true })
      .orderBy('er.rateDate', 'DESC')
      .take(1);
    return qb.getOne();
  }
}
