import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { NotificationRepository } from '../repositories/notification.repository';
import { FacebookMessengerService } from './facebook-messenger.service';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import type { PreferredContactMethod } from '../../customers/entities/customer.orm-entity';
import type { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
export interface SendArrivalNotificationsParams {
    merchant: MerchantOrmEntity;
    orderId: number;
    customers: Array<{
        id: number;
        contactFacebook?: string | null;
        contactLine?: string | null;
        contactWhatsapp?: string | null;
        preferredContactMethod?: PreferredContactMethod | null;
        token: string;
    }>;
    messageContent: string;
    notificationLinkPath: string;
}
export declare class NotificationSendService {
    private readonly notificationRepository;
    private readonly facebookMessengerService;
    private readonly configService;
    constructor(notificationRepository: NotificationRepository, facebookMessengerService: FacebookMessengerService, configService: ConfigService);
    sendArrivalNotifications(manager: EntityManager, params: SendArrivalNotificationsParams): Promise<NotificationOrmEntity[]>;
}
