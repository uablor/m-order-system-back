import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { ArrivalOrmEntity } from './arrival.orm-entity';
import { OrderItemOrmEntity } from '../../orders/entities/order-item.orm-entity';
export type ArrivalItemCondition = 'OK' | 'DAMAGED' | 'LOST';
export declare class ArrivalItemOrmEntity extends BaseOrmEntity {
    arrival: ArrivalOrmEntity;
    orderItem: OrderItemOrmEntity;
    arrivedQuantity: number;
    condition: ArrivalItemCondition | null;
    notes: string | null;
}
