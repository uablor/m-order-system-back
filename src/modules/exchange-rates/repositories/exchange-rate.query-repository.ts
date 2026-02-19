import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class ExchangeRateQueryRepository extends BaseQueryRepository<ExchangeRateOrmEntity> {
  constructor(
    @InjectRepository(ExchangeRateOrmEntity)
    repository: Repository<ExchangeRateOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: {
      page?: number;
      limit?: number;
      merchantId?: number;
      rateType?: string;
      baseCurrency?: string;
      targetCurrency?: string;
      isActive?: boolean;
    },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ExchangeRateOrmEntity>> {
    const where: FindOptionsWhere<ExchangeRateOrmEntity> = {};
    if (options.merchantId != null) where.merchant = { id: options.merchantId };
    if (options.rateType != null) where.rateType = options.rateType as 'BUY' | 'SELL';
    if (options.baseCurrency != null) where.baseCurrency = options.baseCurrency;
    if (options.targetCurrency != null) where.targetCurrency = options.targetCurrency;
    if (options.isActive !== undefined) where.isActive = options.isActive;

    return super.findWithPagination(
      {
        page: options.page,
        limit: options.limit,
        where: Object.keys(where).length ? where : undefined,
        order: { rateDate: 'DESC' as const, id: 'DESC' as const },
      },
      manager,
      ['merchant', 'createdByUser'],
    );
  }

  /**
   * Get the latest exchange rate for merchant on or before rateDate for the given currency pair and type.
   */
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
