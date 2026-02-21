import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationOrmEntity } from './entities/notification.orm-entity';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationQueryRepository } from './repositories/notification.query-repository';
import { NotificationCommandService } from './services/notification-command.service';
import { NotificationQueryService } from './services/notification-query.service';
import { NotificationSendService } from './services/notification-send.service';
import { FacebookMessengerService } from './services/facebook-messenger.service';
import { NotificationController } from './controllers/notification.controller';
import { TransactionService } from '../../common/transaction/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationOrmEntity]),
  ],
  controllers: [NotificationController],
  providers: [
    TransactionService,
    NotificationRepository,
    NotificationQueryRepository,
    NotificationCommandService,
    NotificationQueryService,
    NotificationSendService,
    FacebookMessengerService,
  ],
  exports: [
    NotificationRepository,
    NotificationCommandService,
    NotificationQueryService,
    NotificationSendService,
  ],
})
export class NotificationModule {}
