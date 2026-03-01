import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from './order.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';
import { ExchangeRateOrmEntity } from 'src/modules/exchange-rates/entities/exchange-rate.orm-entity';
import { ImageOrmEntity } from 'src/modules/images/entities/image.orm-entity';

export type DiscountType = 'PERCENT' | 'FIX';
@Entity('order_items')
export class OrderItemOrmEntity extends BaseOrmEntity {

  // ออเดอร์ที่สินค้าชิ้นนี้อยู่ (ถ้าลบ order จะลบ items ทั้งหมด)
  @ManyToOne(() => OrderOrmEntity, (o) => o.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderOrmEntity;

  // รูปสินค้า
  @Column({ name: 'image_id', type: 'int', nullable: true })
  imageId: number | null;

  @ManyToOne(() => ImageOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: ImageOrmEntity | null;

  // ลำดับสินค้าในออเดอร์ (ใช้สำหรับเรียงสินค้า)
  @Column({ name: 'order_item_index', type: 'int', nullable: true })
  orderItemIndex: number | null;

  // ชื่อสินค้า
  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  productName: string;

  // ตัวแปรสินค้า เช่น สี / ขนาด / รุ่น
  @Column({ type: 'varchar', length: 255, nullable: true })
  variant: string | null;

  // จำนวนสินค้าที่สั่งซื้อมา
  @Column({ type: 'int', default: 0 })
  quantity: number;

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

  // ราคาซื้อของสินค้าต่อหน่วย (ตาม exchangeRateBuy)
  @Column({ name: 'purchase_price', type: 'decimal', precision: 18, scale: 4, default: 0 })
  purchasePrice: number;

  // ต้นทุนซื้อรวมทั้งหมดแปลงเป็น LAK
  // purchase_price * quantity * exchange_rate
  @Column({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  purchaseTotal: number;

  // ค่าขนส่งต่อหน่วย (อาจเป็น foreign currency)
  @Column({ name: 'shipping_price', type: 'decimal', precision: 18, scale: 4, default: 0, nullable: true })
  shippingPrice: number | null;

  // ต้นทุนรวมก่อนหักส่วนลด (purchase + shipping)
  @Column({ name: 'total_cost_before_discount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalCostBeforeDiscount: number;

  // ประเภทส่วนลด
  // PERCENT = ลด %
  // FIX = ลดจำนวนเงิน
  @Column({ name: 'discount_type', type: 'varchar', length: 10, nullable: true })
  discountType: DiscountType | null;

  // ค่าส่วนลด (% หรือ จำนวนเงิน)
  @Column({ name: 'discount_value', type: 'decimal', precision: 18, scale: 4, nullable: true })
  discountValue: number | null;

  // จำนวนเงินส่วนลดรวมทั้งหมด
  @Column({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discountAmount: number;

  // ต้นทุนสุทธิหลังหักส่วนลด (หน่วย)
  @Column({ name: 'final_cost', type: 'decimal', precision: 18, scale: 2, default: 0 })
  finalCost: number;

  // ราคาขายต่อหน่วยในสกุลเงินต่างประเทศ
  @Column({ name: 'selling_price_foreign', type: 'decimal', precision: 18, scale: 4, default: 0 })
  sellingPriceForeign: number;

  // ยอดขายรวมทั้งหมด
  @Column({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  sellingTotal: number;

  // กำไรรวมทั้งหมด (หน่วย LAK)
  // selling_total - final_cost
  @Column({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 })
  profit: number;

  // รายการขายสินค้าชิ้นนี้ให้ลูกค้า (1 order item → many customer orders)
  @OneToMany(() => CustomerOrderItemOrmEntity, (coi) => coi.orderItem)
  customerOrderItems: CustomerOrderItemOrmEntity[];
}