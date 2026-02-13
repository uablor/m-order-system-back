import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateOrmEntity } from './entities/exchange-rate.orm-entity';
import { ExchangeRateRepository } from './repositories/exchange-rate.repository';
import { ExchangeRateQueryRepository } from './repositories/exchange-rate.query-repository';
import { TransactionService } from '../../common/transaction/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRateOrmEntity])],
  providers: [ExchangeRateRepository, ExchangeRateQueryRepository, TransactionService],
  exports: [ExchangeRateRepository, ExchangeRateQueryRepository],
})
export class ExchangeRateModule {}
