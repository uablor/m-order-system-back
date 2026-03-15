import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from '../../orders/entities/order.orm-entity';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { ArrivalItemOrmEntity } from './arrival-item.orm-entity';

@Entity('arrivals')
export class ArrivalOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => OrderOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderOrmEntity;

  @ManyToOne(() => MerchantOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantOrmEntity;

  @Column({ name: 'arrived_date', type: 'date' })
  arrivedDate: Date;

  @Column({ name: 'arrived_time', type: 'time' })
  arrivedTime: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'recorded_by' })
  recordedByUser: UserOrmEntity | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => ArrivalItemOrmEntity, (ai) => ai.arrival)
  arrivalItems: ArrivalItemOrmEntity[];
}
