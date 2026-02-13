import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';

@Injectable()
export class ExchangeRateRepository extends BaseRepository<ExchangeRateOrmEntity> {
  constructor(
    @InjectRepository(ExchangeRateOrmEntity)
    repository: Repository<ExchangeRateOrmEntity>,
  ) {
    super(repository);
  }
}
