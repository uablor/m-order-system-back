import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';

export type ExchangeRateType = 'BUY' | 'SELL';

@Entity('exchange_rates')
export class ExchangeRateOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => MerchantOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantOrmEntity;

  @Column({ name: 'base_currency', type: 'varchar', length: 10 })
  baseCurrency: string;

  @Column({ name: 'target_currency', type: 'varchar', length: 10 })
  targetCurrency: string;

  @Column({ name: 'rate_type', type: 'varchar', length: 10 })
  rateType: ExchangeRateType;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  rate: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'rate_date', type: 'date' })
  rateDate: Date;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity | null;
}
