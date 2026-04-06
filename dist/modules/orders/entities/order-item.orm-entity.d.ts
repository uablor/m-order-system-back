import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { OrderOrmEntity } from './order.orm-entity';
import { ImageOrmEntity } from 'src/modules/images/entities/image.orm-entity';
import { OrderItemSkuOrmEntity } from './order-item-sku.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';
export type DiscountType = 'PERCENT' | 'FIX';
export declare class OrderItemOrmEntity extends BaseOrmEntity {
    order: OrderOrmEntity;
    customerOrderItems: CustomerOrderItemOrmEntity[];
    image: ImageOrmEntity | null;
    imageId: number | null;
    skus: OrderItemSkuOrmEntity[];
    productName: string;
    discountType: DiscountType | null;
    discountValue: number | null;
    quantity: number;
    purchaseTotal: number;
    shippingTotal: number;
    totalCostBeforeDiscount: number;
    discountAmount: number;
    finalCost: number;
    sellingTotal: number;
    profit: number;
}
