import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from './order.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';
import { NotificationOrmEntity } from 'src/modules/notifications/entities/notification.orm-entity';
import { PaymentStatusEnum } from 'src/modules/payments/enum/payment.enum';
export declare class CustomerOrderOrmEntity extends BaseOrmEntity {
    order: OrderOrmEntity;
    customer: CustomerOrmEntity;
    totalSellingAmount: number;
    totalPaid: number;
    remainingAmount: number;
    paymentStatus: PaymentStatusEnum;
    customerOrderItems: CustomerOrderItemOrmEntity[];
    notification: NotificationOrmEntity;
}
