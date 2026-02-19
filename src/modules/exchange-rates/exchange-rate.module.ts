import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateOrmEntity } from './entities/exchange-rate.orm-entity';
import { ExchangeRateRepository } from './repositories/exchange-rate.repository';
import { ExchangeRateQueryRepository } from './repositories/exchange-rate.query-repository';
import { ExchangeRateCommandService } from './services/exchange-rate-command.service';
import { ExchangeRateQueryService } from './services/exchange-rate-query.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRateOrmEntity]),
    MerchantModule,
  ],
  controllers: [ExchangeRateController],
  providers: [
    ExchangeRateRepository,
    ExchangeRateQueryRepository,
    ExchangeRateCommandService,
    ExchangeRateQueryService,
    TransactionService,
  ],
  exports: [
    ExchangeRateRepository,
    ExchangeRateQueryRepository,
    ExchangeRateCommandService,
    ExchangeRateQueryService,
  ],
})
export class ExchangeRateModule {}
