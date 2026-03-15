import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';
import { BaseOrmEntity } from 'src/common/base/enities/base.orm-entities';
import { ExchangeRateOrmEntity } from 'src/modules/exchange-rates/entities/exchange-rate.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';

// @Entity('order_item_sku')
// export class OrderItemSkuOrmEntity extends BaseOrmEntity {
//   @ManyToOne(() => OrderItemOrmEntity, (order) => order.sku)
//   @JoinColumn({ name: 'order_item' })
//   orderItem: OrderOrmEntity;

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

//   // purchase_price * quantity * exchange_rate
//   @Column({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
//   purchaseTotal: number;

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


// }


@Entity('order_item_skus')
export class OrderItemSkuOrmEntity extends BaseOrmEntity {


  @Column({ name: 'order_item_sku_index', type: 'int', nullable: true })
  orderItemSkuIndex: number | null;

  @OneToMany(() => CustomerOrderItemOrmEntity, (coi) => coi.orderItemSku)
  customerOrderItems: CustomerOrderItemOrmEntity[];

  // ─── Relationships ──────────────────────────────────────────────

  @ManyToOne(() => OrderItemOrmEntity, (item) => item.skus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItemOrmEntity;

  // FK เก็บไว้ lookup อัตราแลกเปลี่ยนต้นทาง
  @ManyToOne(() => ExchangeRateOrmEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'exchange_rate_buy_id' })
  exchangeRateBuy: ExchangeRateOrmEntity | null;

  @ManyToOne(() => ExchangeRateOrmEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'exchange_rate_sell_id' })
  exchangeRateSell: ExchangeRateOrmEntity | null;

  // ─── Variant Info ────────────────────────────────────────────────
  // snapshot ชื่อ variant เช่น "แดง / XL" เผื่อ product แก้ในอนาคต

  @Column({ type: 'varchar', length: 255, nullable: true })
  variant: string | null;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  // ─── Exchange Rate Snapshot ──────────────────────────────────────
  // เก็บค่า ณ เวลาสั่ง เพราะอัตราแลกเปลี่ยนเปลี่ยนทุกวัน

  @Column({ name: 'exchange_rate_buy_value', type: 'decimal', precision: 18, scale: 6, nullable: true })
  exchangeRateBuyValue: number | null;   // foreign → LAK

  @Column({ name: 'exchange_rate_sell_value', type: 'decimal', precision: 18, scale: 6, nullable: true })
  exchangeRateSellValue: number | null;  // LAK → foreign

  // ─── Purchase (ต้นทุนซื้อ) ────────────────────────────────────────

  // ราคาซื้อต่อหน่วย (foreign currency)
  @Column({ name: 'purchase_price', type: 'decimal', precision: 18, scale: 4, default: 0 })
  purchasePrice: number;

  // purchasePrice * quantity * exchangeRateBuyValue 
  @Column({ name: 'purchase_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  purchaseTotal: number;

  // // ค่าขนส่งต่อหน่วย (foreign currency)
  // @Column({ name: 'shipping_price', type: 'decimal', precision: 18, scale: 4, nullable: true, default: 0 })
  // shippingPrice: number | null;

  // // shippingPrice * quantity * exchangeRateBuyValue 
  // @Column({ name: 'shipping_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  // shippingTotal: number;

  // ─── Selling (ราคาขาย) ────────────────────────────────────────────

  // ราคาขายต่อหน่วย (foreign currency)
  @Column({ name: 'selling_price_foreign', type: 'decimal', precision: 18, scale: 4, default: 0 })
  sellingPriceForeign: number;

  // sellingPriceForeign * quantity * exchangeRateSellValue 
  @Column({ name: 'selling_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  sellingTotal: number;

  // sellingTotal - purchaseTotal - shippingTotal  (ก่อนหักส่วนลด)
  @Column({ name: 'profit', type: 'decimal', precision: 18, scale: 2, default: 0 })
  profit: number;
}