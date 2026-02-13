import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalOrmEntity } from './entities/arrival.orm-entity';
import { ArrivalItemOrmEntity } from './entities/arrival-item.orm-entity';
import { NotificationOrmEntity } from './entities/notification.orm-entity';
import { ArrivalRepository } from './repositories/arrival.repository';
import { ArrivalItemRepository } from './repositories/arrival-item.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { ArrivalQueryRepository } from './repositories/arrival.query-repository';
import { ArrivalItemQueryRepository } from './repositories/arrival-item.query-repository';
import { NotificationQueryRepository } from './repositories/notification.query-repository';
import { ArrivalCommandService } from './services/arrival-command.service';
import { ArrivalQueryService } from './services/arrival-query.service';
import { ArrivalItemCommandService } from './services/arrival-item-command.service';
import { ArrivalItemQueryService } from './services/arrival-item-query.service';
import { NotificationCommandService } from './services/notification-command.service';
import { NotificationQueryService } from './services/notification-query.service';
import { ArrivalController } from './controllers/arrival.controller';
import { ArrivalItemController } from './controllers/arrival-item.controller';
import { NotificationController } from './controllers/notification.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { OrderModule } from '../orders/order.module';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArrivalOrmEntity, ArrivalItemOrmEntity, NotificationOrmEntity]),
    OrderModule,
    MerchantModule,
  ],
  controllers: [ArrivalController, ArrivalItemController, NotificationController],
  providers: [
    ArrivalRepository,
    ArrivalItemRepository,
    NotificationRepository,
    ArrivalQueryRepository,
    ArrivalItemQueryRepository,
    NotificationQueryRepository,
    ArrivalCommandService,
    ArrivalQueryService,
    ArrivalItemCommandService,
    ArrivalItemQueryService,
    NotificationCommandService,
    NotificationQueryService,
    TransactionService,
  ],
  exports: [
    ArrivalRepository,
    ArrivalItemRepository,
    NotificationRepository,
    ArrivalCommandService,
    ArrivalQueryService,
    ArrivalItemCommandService,
    ArrivalItemQueryService,
    NotificationCommandService,
    NotificationQueryService,
  ],
})
export class ArrivalModule {}
