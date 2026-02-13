import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from './order.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';

export type DiscountType = 'PERCENT' | 'FIX';

@Entity('order_items')
export class OrderItemOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => OrderOrmEntity, (o) => o.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderOrmEntity;

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  variant: string | null;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  /** Remaining quantity available for customer orders (stock). Decremented when customer_order_items are created. */
  @Column({ name: 'quantity_remaining', type: 'int', default: 0 })
  quantityRemaining: number;

  @Column({ name: 'purchase_currency', type: 'varchar', length: 10 })
  purchaseCurrency: string;

  @Column({ name: 'purchase_price', type: 'decimal', precision: 18, scale: 4, default: 0 })
  purchasePrice: string;

  @Column({ name: 'purchase_exchange_rate', type: 'decimal', precision: 18, scale: 6, default: 1 })
  purchaseExchangeRate: string;

  @Column({ name: 'purchase_total_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  purchaseTotalLak: string;

  @Column({ name: 'total_cost_before_discount_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalCostBeforeDiscountLak: string;

  @Column({ name: 'discount_type', type: 'varchar', length: 10, nullable: true })
  discountType: DiscountType | null;

  @Column({ name: 'discount_value', type: 'decimal', precision: 18, scale: 4, nullable: true })
  discountValue: string | null;

  @Column({ name: 'discount_amount_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discountAmountLak: string;

  @Column({ name: 'final_cost_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  finalCostLak: string;

  @Column({ name: 'final_cost_thb', type: 'decimal', precision: 18, scale: 2, default: 0 })
  finalCostThb: string;

  @Column({ name: 'selling_price_foreign', type: 'decimal', precision: 18, scale: 4, default: 0 })
  sellingPriceForeign: string;

  @Column({ name: 'selling_exchange_rate', type: 'decimal', precision: 18, scale: 6, default: 1 })
  sellingExchangeRate: string;

  @Column({ name: 'selling_total_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  sellingTotalLak: string;

  @Column({ name: 'profit_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  profitLak: string;

  @Column({ name: 'profit_thb', type: 'decimal', precision: 18, scale: 2, default: 0 })
  profitThb: string;

  @OneToMany(() => CustomerOrderItemOrmEntity, (coi) => coi.orderItem)
  customerOrderItems: CustomerOrderItemOrmEntity[];
}
