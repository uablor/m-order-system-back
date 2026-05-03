import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from './order.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';
import { NotificationOrmEntity } from 'src/modules/notifications/entities/notification.orm-entity';
import { PaymentStatusEnum } from 'src/modules/payments/enum/payment.enum';

export type DiscountType = 'PERCENT' | 'FIX';

@Entity('customer_orders')
export class CustomerOrderOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => OrderOrmEntity, (o) => o.customerOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderOrmEntity;

  @ManyToOne(() => CustomerOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerOrmEntity;

  @Column({ name: 'total_selling_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalSellingAmount: number;

  @Column({ name: 'total_paid', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalPaid: number;

  @Column({ name: 'remaining_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  remainingAmount: number;

  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatusEnum, default: PaymentStatusEnum.NOT_CREATED })
  paymentStatus: PaymentStatusEnum;

  // ─── Discount (at customer order level) ─────────────────────────
  // PERCENT = ສ່ວນຫຼຸດເປີເຊັນ (จาก purchaseTotal)
  // FIX     = ສ່ວນຫຼຸດເງິນສົດ

  @Column({ name: 'discount_type', type: 'varchar', length: 10, nullable: true })
  discountType: DiscountType | null;

  @Column({ name: 'discount_value', type: 'decimal', precision: 18, scale: 4, nullable: true })
  discountValue: number | null;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discountAmount: number;

  @OneToMany(() => CustomerOrderItemOrmEntity, (coi) => coi.customerOrder)
  customerOrderItems: CustomerOrderItemOrmEntity[];

  @ManyToOne(() => NotificationOrmEntity, (notification) => notification.customerOrder, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'notification_id' })
  notification: NotificationOrmEntity;
}
