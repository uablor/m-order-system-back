import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { CustomerOrderOrmEntity } from './customer-order.orm-entity';
import { OrderItemSkuOrmEntity } from './order-item-sku.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';
export declare class CustomerOrderItemOrmEntity extends BaseOrmEntity {
    customerOrder: CustomerOrderOrmEntity;
    orderItemSku: OrderItemSkuOrmEntity;
    orderItem: OrderItemOrmEntity;
    quantity: number;
    sellingPriceForeign: number;
    purchasePrice: number;
    purchaseTotal: number;
    sellingTotal: number;
    profit: number;
}
