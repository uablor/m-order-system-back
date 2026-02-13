import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';

export type DefaultCurrency = 'THB' | 'USD' | 'LAK';

@Entity('merchants')
export class MerchantOrmEntity extends BaseOrmEntity {
  @Column({ name: 'owner_user_id', type: 'int' })
  ownerUserId: number;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_user_id' })
  ownerUser: UserOrmEntity;

  @Column({ name: 'shop_name', type: 'varchar', length: 255 })
  shopName: string;

  @Column({ name: 'shop_logo_url', type: 'text', nullable: true })
  shopLogoUrl: string | null;

  @Column({ name: 'shop_address', type: 'text', nullable: true })
  shopAddress: string | null;

  @Column({ name: 'contact_phone', type: 'varchar', length: 50, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'contact_email', type: 'varchar', length: 255, nullable: true })
  contactEmail: string | null;

  @Column({ name: 'contact_facebook', type: 'text', nullable: true })
  contactFacebook: string | null;

  @Column({ name: 'contact_line', type: 'text', nullable: true })
  contactLine: string | null;

  @Column({ name: 'contact_whatsapp', type: 'varchar', length: 50, nullable: true })
  contactWhatsapp: string | null;

  @Column({ name: 'default_currency', type: 'varchar', length: 10, default: 'THB' })
  defaultCurrency: DefaultCurrency;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
