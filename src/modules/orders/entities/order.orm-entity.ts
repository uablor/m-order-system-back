import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';
import { CustomerOrderOrmEntity } from './customer-order.orm-entity';
import { ArrivalStatusEnum, PaymentStatusEnum } from '../enum/enum.entities';
import { ExchangeRateOrmEntity } from 'src/modules/exchange-rates/entities/exchange-rate.orm-entity';

@Entity('orders')
export class OrderOrmEntity extends BaseOrmEntity {
  // ร้านค้าที่เป็นเจ้าของออเดอร์นี้ (ถ้าลบร้าน จะลบออเดอร์ทั้งหมดด้วย)
  @ManyToOne(() => MerchantOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantOrmEntity;

  // ผู้ใช้ที่เป็นคนสร้างออเดอร์ (ถ้าลบ user จะ set เป็น null)
  @ManyToOne(() => UserOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity | null;

  // รหัสออเดอร์ ใช้สำหรับอ้างอิง
  @Column({ name: 'order_code', type: 'varchar', length: 100 })
  orderCode: string;

  // วันที่ทำรายการสั่งซื้อ
  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  // สถานะการมาถึงของสินค้า (เช่น ยังไม่ถึง, ถึงแล้ว)
  @Column({ name: 'arrival_status', type: 'varchar', length: 20, default: ArrivalStatusEnum.NOT_ARRIVED })
  arrivalStatus: ArrivalStatusEnum;

  // วันเวลาที่สินค้ามาถึงจริง
  @Column({ name: 'arrived_at', type: 'datetime', nullable: true })
  arrivedAt: Date | null;

  // วันเวลาที่มีการแจ้งลูกค้าว่าสินค้ามาถึงแล้ว
  @Column({ name: 'notified_at', type: 'datetime', nullable: true })
  notifiedAt: Date | null;

  // อัตราแลกเปลี่ยนสำหรับการซื้อ (สกุลเงินต่างประเทศ -> กีบ)
  @ManyToOne(() => ExchangeRateOrmEntity, { nullable: true })
  @JoinColumn({ name: 'exchange_rate_buy_id' })
  exchangeRateBuy: ExchangeRateOrmEntity | null;

  // อัตราแลกเปลี่ยนสำหรับการขาย (กีบ -> สกุลเงินต่างประเทศ)
  @ManyToOne(() => ExchangeRateOrmEntity, { nullable: true })
  @JoinColumn({ name: 'exchange_rate_sell_id' })
  exchangeRateSell: ExchangeRateOrmEntity | null;

  // อัตราแลกเปลี่ยนซื้อ (สกุลเงินต่างประเทศ -> กีบ)
  @Column({ name: 'exchange_rate_buy', type: 'decimal', precision: 18, scale: 6, nullable: true })
  exchangeRateBuyValue: number | null;

  // อัตราแลกเปลี่ยนขาย (กีบ -> สกุลเงินต่างประเทศ)
  @Column({ name: 'exchange_rate_sell', type: 'decimal', precision: 18, scale: 6, nullable: true })
  exchangeRateSellValue: number | null;

  // ต้นทุนราคาซื้อรวมทั้งหมด (หน่วย: กีบ)
  @Column({ name: 'total_purchase_cost', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalPurchaseCost: number;

  // ต้นทุนค่าขนส่งรวมทั้งหมด (หน่วย: กีบ)
  @Column({ name: 'total_shipping_cost', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalShippingCost: number;

  // ต้นทุนรวมก่อนหักส่วนลด (หน่วย: กีบ)
  @Column({ name: 'total_cost_before_discount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalCostBeforeDiscount: number;

  // จำนวนเงินส่วนลดรวมทั้งหมด (หน่วย: กีบ)
  @Column({ name: 'total_discount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalDiscount: number;

  // ต้นทุนสุทธิหลังหักส่วนลดแล้ว
  @Column({ name: 'total_final_cost', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalFinalCost: number;

  // ยอดขายรวมทั้งหมด
  @Column({ name: 'total_selling_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalSellingAmount: number;

  // กำไรรวมทั้งหมด 
  @Column({ name: 'total_profit', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalProfit: number;

  // สถานะการชำระเงิน (เช่น ยังไม่จ่าย, จ่ายบางส่วน, จ่ายครบแล้ว)
  @Column({ name: 'payment_status', type: 'varchar', length: 20, default: 'UNPAID' })
  paymentStatus: PaymentStatusEnum;

  // รายการสินค้าในออเดอร์นี้ (1 ออเดอร์ มีหลายสินค้า)
  @OneToMany(() => OrderItemOrmEntity, (item) => item.order)
  orderItems: OrderItemOrmEntity[];

  // ความสัมพันธ์ระหว่างออเดอร์กับลูกค้า (1 ออเดอร์ อาจมีหลายลูกค้า)
  @OneToMany(() => CustomerOrderOrmEntity, (co) => co.order)
  customerOrders: CustomerOrderOrmEntity[];
}