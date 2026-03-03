import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';
import { CustomerOrderOrmEntity } from 'src/modules/orders/entities/customer-order.orm-entity';
import { NotificationChannel, NotificationStatus, NotificationType } from '../enum/notification.enum';


@Entity('notifications')
export class NotificationOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MerchantOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantOrmEntity;

  @Column({ name: 'unique_token', type: 'varchar', length: 255 })
  uniqueToken: string;

  @ManyToOne(() => CustomerOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerOrmEntity;

  @OneToMany(() => CustomerOrderOrmEntity, (customerOrder) => customerOrder.notification)
  customerOrder: CustomerOrderOrmEntity[];

  @Column({ name: 'notification_type', type: 'enum', enum: NotificationType, default: NotificationType.ARRIVAL })
  notificationType: NotificationType;

  @Column({ type: 'enum', enum: NotificationChannel, default: NotificationChannel.FB })
  channel: NotificationChannel;

  @Column({ name: 'recipient_contact', type: 'varchar', length: 255 })
  recipientContact: string;

  @Column({ name: 'message_content', type: 'text' })
  messageContent: string;

  @Column({ name: 'notification_link', type: 'text', nullable: true })
  notificationLink: string | null;

  @Column({ name: 'retry_count', type: 'int', default: 0 })
  retryCount: number;

  @Column({ name: 'last_retry_at', type: 'datetime', nullable: true })
  lastRetryAt: Date | null;

  @Column({ type: 'enum', enum: NotificationStatus , default: NotificationStatus.SENT })
  status: NotificationStatus;

  @Column({ name: 'sent_at', type: 'datetime', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'related_orders', type: 'json', nullable: true })
  relatedOrders: number[] | null;
}
