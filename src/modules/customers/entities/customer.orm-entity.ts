import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';

export type CustomerType = 'CUSTOMER' | 'AGENT';
export type PreferredContactMethod = 'PHONE' | 'FACEBOOK' | 'WHATSAPP' | 'LINE';

@Entity('customers')
export class CustomerOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MerchantOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantOrmEntity;

  @Column({ name: 'customer_name', type: 'varchar', length: 255 })
  customerName: string;

  @Column({ name: 'customer_type', type: 'varchar', length: 20 })
  customerType: CustomerType;

  @Column({ name: 'shipping_address', type: 'text', nullable: true })
  shippingAddress: string | null;

  @Column({ name: 'shipping_provider', type: 'varchar', length: 100, nullable: true })
  shippingProvider: string | null;

  @Column({ name: 'shipping_source', type: 'varchar', length: 255, nullable: true })
  shippingSource: string | null;

  @Column({ name: 'shipping_destination', type: 'varchar', length: 255, nullable: true })
  shippingDestination: string | null;

  @Column({ name: 'payment_terms', type: 'text', nullable: true })
  paymentTerms: string | null;

  @Column({ name: 'contact_phone', type: 'varchar', length: 50, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'contact_facebook', type: 'text', nullable: true })
  contactFacebook: string | null;

  @Column({ name: 'contact_whatsapp', type: 'varchar', length: 50, nullable: true })
  contactWhatsapp: string | null;

  @Column({ name: 'contact_line', type: 'text', nullable: true })
  contactLine: string | null;

  @Column({ name: 'preferred_contact_method', type: 'varchar', length: 20, nullable: true })
  preferredContactMethod: PreferredContactMethod | null;

  @Column({ name: 'unique_token', type: 'varchar', length: 255, unique: true })
  uniqueToken: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
