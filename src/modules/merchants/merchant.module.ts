import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantOrmEntity } from './entities/merchant.orm-entity';
import { MerchantRepository } from './repositories/merchant.repository';
import { MerchantQueryRepository } from './repositories/merchant.query-repository';
import { MerchantCommandService } from './services/merchant-command.service';
import { MerchantQueryService } from './services/merchant-query.service';
import { MerchantController } from './controllers/merchant.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { ImageModule } from '../images/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantOrmEntity]),
    ImageModule,
  ],
  controllers: [MerchantController],
  providers: [
    MerchantRepository,
    MerchantQueryRepository,
    MerchantCommandService,
    MerchantQueryService,
    TransactionService,
  ],
  exports: [MerchantRepository, MerchantQueryRepository, MerchantCommandService, MerchantQueryService],
})
export class MerchantModule {}
