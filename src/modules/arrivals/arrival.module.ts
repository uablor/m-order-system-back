import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalOrmEntity } from './entities/arrival.orm-entity';
import { ArrivalItemOrmEntity } from './entities/arrival-item.orm-entity';
import { ArrivalRepository } from './repositories/arrival.repository';
import { ArrivalItemRepository } from './repositories/arrival-item.repository';
import { ArrivalQueryRepository } from './repositories/arrival.query-repository';
import { ArrivalItemQueryRepository } from './repositories/arrival-item.query-repository';
import { ArrivalCommandService } from './services/arrival-command.service';
import { ArrivalQueryService } from './services/arrival-query.service';
import { ArrivalItemCommandService } from './services/arrival-item-command.service';
import { ArrivalItemQueryService } from './services/arrival-item-query.service';
import { ArrivalController } from './controllers/arrival.controller';
import { ArrivalItemController } from './controllers/arrival-item.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { OrderModule } from '../orders/order.module';
import { MerchantModule } from '../merchants/merchant.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArrivalOrmEntity, ArrivalItemOrmEntity]),
    OrderModule,
    MerchantModule,
    NotificationModule,
  ],
  controllers: [ArrivalController, ArrivalItemController],
  providers: [
    ArrivalRepository,
    ArrivalItemRepository,
    ArrivalQueryRepository,
    ArrivalItemQueryRepository,
    ArrivalCommandService,
    ArrivalQueryService,
    ArrivalItemCommandService,
    ArrivalItemQueryService,
    TransactionService,
  ],
  exports: [
    ArrivalRepository,
    ArrivalItemRepository,
    ArrivalCommandService,
    ArrivalQueryService,
    ArrivalItemCommandService,
    ArrivalItemQueryService,
  ],
})
export class ArrivalModule {}
