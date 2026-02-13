import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalOrmEntity } from './entities/arrival.orm-entity';
import { ArrivalItemOrmEntity } from './entities/arrival-item.orm-entity';
import { NotificationOrmEntity } from './entities/notification.orm-entity';
import { ArrivalRepository } from './repositories/arrival.repository';
import { ArrivalItemRepository } from './repositories/arrival-item.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { ArrivalCommandService } from './services/arrival-command.service';
import { ArrivalController } from './controllers/arrival.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { OrderModule } from '../orders/order.module';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArrivalOrmEntity, ArrivalItemOrmEntity, NotificationOrmEntity]),
    OrderModule,
    MerchantModule,
  ],
  controllers: [ArrivalController],
  providers: [
    ArrivalRepository,
    ArrivalItemRepository,
    NotificationRepository,
    ArrivalCommandService,
    TransactionService,
  ],
  exports: [ArrivalRepository, ArrivalItemRepository, NotificationRepository, ArrivalCommandService],
})
export class ArrivalModule {}
