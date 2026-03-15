import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from './order.orm-entity';
import { ImageOrmEntity } from 'src/modules/images/entities/image.orm-entity';
import { OrderItemSkuOrmEntity } from './order-item-sku.orm-entity';

export type DiscountType = 'PERCENT' | 'FIX';

// @Entity('order_items')
// export class OrderItemOrmEntity extends BaseOrmEntity {

//   // ออเดอร์ที่สินค้าชิ้นนี้อยู่ (ถ้าลบ order จะลบ items ทั้งหมด)
//   @ManyToOne(() => OrderOrmEntity, (o) => o.orderItems, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'order_id' })
//   order: OrderOrmEntity;

//   // รูปสินค้า
//   @Column({ name: 'image_id', type: 'int', nullable: true })
//   imageId: number | null;

//   @ManyToOne(() => ImageOrmEntity, { onDelete: 'SET NULL', nullable: true })
//   @JoinColumn({ name: 'image_id' })
//   image: ImageOrmEntity | null;

//   // ลำดับสินค้าในออเดอร์ (ใช้สำหรับเรียงสินค้า)
//   @Column({ name: 'order_item_index', type: 'int', nullable: true })
//   orderItemIndex: number | null;

//   // ชื่อสินค้า
//   @Column({ name: 'product_name', type: 'varchar', length: 255 })
//   productName: string;

//   // ตัวแปรสินค้า เช่น สี / ขนาด / รุ่น
//   @Column({ type: 'varchar', length: 255, nullable: true })
//   variant: string | null;

//   @OneToMany(() => OrderItemSkuOrmEntity, (oos) => oos.orderItem, { onDelete: 'CASCADE' })
//   sku: OrderItemSkuOrmEntity[];

//   // จำนวนสินค้าที่สั่งซื้อมา
//   @Column({ type: 'int', default: 0 })
//   quantity: number;

//   // อัตราแลกเปลี่ยนสำหรับการซื้อ (สกุลเงินต่างประเทศ -> กีบ)
//   @ManyToOne(() => ExchangeRateOrmEntity, { nullable: true })
//   @JoinColumn({ name: 'exchange_rate_buy_id' })
//   exchangeRateBuy: ExchangeRateOrmEntity | null;

//   // อัตราแลกเปลี่ยนสำหรับการขาย (กีบ -> สกุลเงินต่างประเทศ)
//   @ManyToOne(() => ExchangeRateOrmEntity, { nullable: true })
//   @JoinColumn({ name: 'exchange_rate_sell_id' })
//   exchangeRateSell: ExchangeRateOrmEntity | null;

//   // อัตราแลกเปลี่ยนซื้อ (สกุลเงินต่างประเทศ -> กีบ)
//   @Column({ name: 'exchange_rate_buy', type: 'decimal', precision: 18, scale: 6, nullable: true })
//   exchangeRateBuyValue: number | null;

//   // อัตราแลกเปลี่ยนขาย (กีบ -> สกุลเงินต่างประเทศ)
//   @Column({ name: 'exchange_rate_sell', type: 'decimal', precision: 18, scale: 6, nullable: true })
//   exchangeRateSellValue: number | null;

//   // ราคาซื้อของสินค้าต่อหน่วย (ตาม exchangeRateBuy)
//   @Column({ name: 'purchase_price', type: 'decimal', precision: 18, scale: 4, default: 0 })
//   purchasePrice: number;

//   // ต้นทุนซื้อรวมทั้งหมดแปลงเป็น LAK
//   // purchase_price * quantity * exchange_rate
//   @Column({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
//   purchaseTotal: number;

//   // ค่าขนส่งต่อหน่วย (อาจเป็น foreign currency)
//   @Column({ name: 'shipping_price', type: 'decimal', precision: 18, scale: 4, default: 0, nullable: true })
//   shippingPrice: number | null;

//   // ต้นทุนรวมก่อนหักส่วนลด (purchase + shipping)
//   @Column({ name: 'total_cost_before_discount', type: 'decimal', precision: 18, scale: 2, default: 0 })
//   totalCostBeforeDiscount: number;

//   // ประเภทส่วนลด
//   // PERCENT = ลด %
//   // FIX = ลดจำนวนเงิน
//   @Column({ name: 'discount_type', type: 'varchar', length: 10, nullable: true })
//   discountType: DiscountType | null;

//   // ค่าส่วนลด (% หรือ จำนวนเงิน)
//   @Column({ name: 'discount_value', type: 'decimal', precision: 18, scale: 4, nullable: true })
//   discountValue: number | null;

//   // จำนวนเงินส่วนลดรวมทั้งหมด
//   @Column({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
//   discountAmount: number;

//   // ต้นทุนสุทธิหลังหักส่วนลด (หน่วย)
//   @Column({ name: 'final_cost', type: 'decimal', precision: 18, scale: 2, default: 0 })
//   finalCost: number;

//   // ราคาขายต่อหน่วยในสกุลเงินต่างประเทศ
//   @Column({ name: 'selling_price_foreign', type: 'decimal', precision: 18, scale: 4, default: 0 })
//   sellingPriceForeign: number;

//   // ยอดขายรวมทั้งหมด
//   @Column({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
//   sellingTotal: number;

//   // กำไรรวมทั้งหมด (หน่วย LAK)
//   // selling_total - final_cost
//   @Column({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 })
//   profit: number;

//   // รายการขายสินค้าชิ้นนี้ให้ลูกค้า (1 order item → many customer orders)
//   @OneToMany(() => CustomerOrderItemOrmEntity, (coi) => coi.orderItem)
//   customerOrderItems: CustomerOrderItemOrmEntity[];
// }


@Entity('order_items')
export class OrderItemOrmEntity extends BaseOrmEntity {

  // ─── Relationships ──────────────────────────────────────────────

  @ManyToOne(() => OrderOrmEntity, (o) => o.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderOrmEntity;

  @ManyToOne(() => ImageOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: ImageOrmEntity | null;

  // variants ราคาต่างกัน → เก็บใน SKU
  @OneToMany(() => OrderItemSkuOrmEntity, (sku) => sku.orderItem, { cascade: true })
  skus: OrderItemSkuOrmEntity[];


  // ─── Product Info (snapshot ณ เวลาสั่ง) ─────────────────────────

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  productName: string;


  // ─── Discount (ใช้กับทุก SKU ใน item นี้) ────────────────────────
  // PERCENT = ลด % จาก totalCostBeforeDiscount
  // FIX     = ลดจำนวนเงินคงที่

  @Column({ name: 'discount_type', type: 'varchar', length: 10, nullable: true })
  discountType: DiscountType | null;

  @Column({ name: 'discount_value', type: 'decimal', precision: 18, scale: 4, nullable: true })
  discountValue: number | null;

  // ─── Aggregated Totals (SUM จากทุก SKU) ──────────────────────────
  // ค่าพวกนี้คำนวณจาก skus ทั้งหมด แล้วค่อย save ลง DB

  // SUM(sku.quantity)
  @Column({ type: 'int', default: 0 })
  quantity: number;

  // SUM(sku.purchaseTotal)  → ต้นทุนซื้อรวม
  @Column({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  purchaseTotal: number;

  // SUM(sku.shippingTotal)  → ค่าขนส่งรวม
  @Column({ name: 'shipping_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  shippingTotal: number;

  // purchaseTotal + shippingTotal
  @Column({ name: 'total_cost_before_discount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalCostBeforeDiscount: number;

  // คำนวณจาก discountType + discountValue
  @Column({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discountAmount: number;

  // totalCostBeforeDiscount - discountAmount
  @Column({ name: 'final_cost', type: 'decimal', precision: 18, scale: 2, default: 0 })
  finalCost: number;

  // SUM(sku.sellingTotal)  → ยอดขายรวม (LAK)
  @Column({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  sellingTotal: number;

  // sellingTotal - finalCost
  @Column({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 })
  profit: number;
}