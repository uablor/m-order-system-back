import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';

@Injectable()
export class ExchangeRateQueryRepository {
  constructor(
    @InjectRepository(ExchangeRateOrmEntity)
    public readonly repository: Repository<ExchangeRateOrmEntity>,
  ) {}

  /**
   * Get the latest exchange rate for merchant on or before rateDate for the given currency pair and type.
   * Used to convert foreign currency to LAK.
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
