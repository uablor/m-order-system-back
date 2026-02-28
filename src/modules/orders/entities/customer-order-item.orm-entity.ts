import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { CustomerOrderOrmEntity } from './customer-order.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';

@Entity('customer_order_items')
export class CustomerOrderItemOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => CustomerOrderOrmEntity, (co) => co.customerOrderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_order_id' })
  customerOrder: CustomerOrderOrmEntity;

  @ManyToOne(() => OrderItemOrmEntity, (oi) => oi.customerOrderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItemOrmEntity;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'selling_price_foreign', type: 'decimal', precision: 18, scale: 4, default: 0 })
  sellingPriceForeign: number;

  @Column({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  sellingTotal: number;

  @Column({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 })
  profit: number;
}
