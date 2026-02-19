import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';
import { CustomerOrderOrmEntity } from './customer-order.orm-entity';
import { ArrivalStatusEnum, PaymentStatusEnum } from '../enum/enum.entities';

@Entity('orders')
export class OrderOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MerchantOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity | null;

  @Column({ name: 'order_code', type: 'varchar', length: 100 })
  orderCode: string;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ name: 'arrival_status', type: 'varchar', length: 20, default: ArrivalStatusEnum.NOT_ARRIVED })
  arrivalStatus: ArrivalStatusEnum;

  @Column({ name: 'arrived_at', type: 'datetime', nullable: true })
  arrivedAt: Date | null;

  @Column({ name: 'notified_at', type: 'datetime', nullable: true })
  notifiedAt: Date | null;

  @Column({ name: 'total_purchase_cost_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalPurchaseCostLak: string;

  @Column({ name: 'total_shipping_cost_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalShippingCostLak: string;

  @Column({ name: 'total_cost_before_discount_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalCostBeforeDiscountLak: string;

  @Column({ name: 'total_discount_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalDiscountLak: string;

  @Column({ name: 'total_final_cost_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalFinalCostLak: string;

  @Column({ name: 'total_final_cost_thb', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalFinalCostThb: string;

  @Column({ name: 'total_selling_amount_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalSellingAmountLak: string;

  @Column({ name: 'total_selling_amount_thb', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalSellingAmountThb: string;

  @Column({ name: 'total_profit_lak', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalProfitLak: string;

  @Column({ name: 'total_profit_thb', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalProfitThb: string;

  @Column({ name: 'deposit_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  depositAmount: string;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  paidAmount: string;

  @Column({ name: 'remaining_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  remainingAmount: string;

  @Column({ name: 'payment_status', type: 'varchar', length: 20, default: 'UNPAID' })
  paymentStatus: PaymentStatusEnum;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order)
  orderItems: OrderItemOrmEntity[];

  @OneToMany(() => CustomerOrderOrmEntity, (co) => co.order)
  customerOrders: CustomerOrderOrmEntity[];
}
