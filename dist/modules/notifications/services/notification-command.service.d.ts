import { TransactionService } from '../../../common/transaction/transaction.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationUpdateDto } from '../dto/notification-update.dto';
import { NotificationStatusUpdateDto } from '../dto/notification-status-update.dto';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';
import { CustomerQueryRepository } from 'src/modules/customers/repositories/customer.query-repository';
import { CreateNotificationDto, CreateNotificationMultipleDto } from '../dto/create-notification.dto';
import { EntityManager } from 'typeorm';
import { NotificationQueryRepository } from '../repositories/notification.query-repository';
export declare class NotificationCommandService {
    private readonly transactionService;
    private readonly notificationRepository;
    private readonly notificationQueryRepository;
    private readonly configService;
    private readonly customerQueryRepository;
    constructor(transactionService: TransactionService, notificationRepository: NotificationRepository, notificationQueryRepository: NotificationQueryRepository, configService: ConfigService, customerQueryRepository: CustomerQueryRepository);
    update(id: number, dto: NotificationUpdateDto): Promise<void>;
    updateStatusSent(id: number, dto: NotificationStatusUpdateDto): Promise<void>;
    delete(id: number): Promise<void>;
    create(dto: CreateNotificationDto, currentUser: CurrentUserPayload, manager?: EntityManager): Promise<NotificationOrmEntity>;
    createMultiple(dto: CreateNotificationMultipleDto, currentUser: CurrentUserPayload): Promise<Array<{
        recipientContact: string;
        notificationLink: string | null;
        language: string | null;
        customer?: {
            customerName?: string;
        } | null;
        relatedOrders: number[] | null;
    }>>;
    private createInternalWithCustomer;
}
