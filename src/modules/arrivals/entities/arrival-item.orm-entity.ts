import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { ArrivalOrmEntity } from './arrival.orm-entity';
import { OrderItemOrmEntity } from '../../orders/entities/order-item.orm-entity';

export type ArrivalItemCondition = 'OK' | 'DAMAGED' | 'LOST';

@Entity('arrival_items')
export class ArrivalItemOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => ArrivalOrmEntity, (a) => a.arrivalItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'arrival_id' })
  arrival: ArrivalOrmEntity;

  @ManyToOne(() => OrderItemOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItemOrmEntity;

  @Column({ name: 'arrived_quantity', type: 'int', default: 0 })
  arrivedQuantity: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  condition: ArrivalItemCondition | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
