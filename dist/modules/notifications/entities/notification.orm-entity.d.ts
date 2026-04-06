import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';
import { CustomerOrderOrmEntity } from 'src/modules/orders/entities/customer-order.orm-entity';
import { NotificationChannel, NotificationStatus, NotificationType } from '../enum/notification.enum';
export declare class NotificationOrmEntity extends BaseOrmEntity {
    merchant: MerchantOrmEntity;
    uniqueToken: string;
    customer: CustomerOrmEntity;
    customerOrder: CustomerOrderOrmEntity[];
    notificationType: NotificationType;
    channel: NotificationChannel;
    recipientContact: string;
    messageContent: string;
    notificationLink: string | null;
    retryCount: number;
    lastRetryAt: Date | null;
    status: NotificationStatus;
    sentAt: Date | null;
    errorMessage: string | null;
    relatedOrders: number[] | null;
    language: string | null;
}
