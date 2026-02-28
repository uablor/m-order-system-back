import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from './order.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';

export type CustomerOrderPaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

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

  @Column({ name: 'payment_status', type: 'varchar', length: 20, default: 'UNPAID' })
  paymentStatus: CustomerOrderPaymentStatus;

  @OneToMany(() => CustomerOrderItemOrmEntity, (coi) => coi.customerOrder)
  customerOrderItems: CustomerOrderItemOrmEntity[];
}
