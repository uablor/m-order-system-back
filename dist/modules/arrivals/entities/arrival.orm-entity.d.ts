import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from '../../orders/entities/order.orm-entity';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { ArrivalItemOrmEntity } from './arrival-item.orm-entity';
export declare class ArrivalOrmEntity extends BaseOrmEntity {
    order: OrderOrmEntity;
    merchant: MerchantOrmEntity;
    arrivedDate: Date;
    arrivedTime: string;
    recordedByUser: UserOrmEntity | null;
    notes: string | null;
    arrivalItems: ArrivalItemOrmEntity[];
}
