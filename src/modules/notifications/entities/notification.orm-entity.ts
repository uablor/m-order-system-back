import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';

export type NotificationType = 'ARRIVAL' | 'PAYMENT' | 'REMINDER';
export type NotificationChannel = 'FB' | 'LINE' | 'WHATSAPP';
export type NotificationStatus = 'SENT' | 'FAILED';

@Entity('notifications')
export class NotificationOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MerchantOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantOrmEntity;

  @ManyToOne(() => CustomerOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerOrmEntity;

  @Column({ name: 'notification_type', type: 'varchar', length: 20 })
  notificationType: NotificationType;

  @Column({ type: 'varchar', length: 20 })
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

  @Column({ type: 'varchar', length: 20 })
  status: NotificationStatus;

  @Column({ name: 'sent_at', type: 'datetime', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'related_orders', type: 'json', nullable: true })
  relatedOrders: number[] | null;
}
