import { OrderItemOrmEntity } from './order-item.orm-entity';
import { BaseOrmEntity } from 'src/common/base/enities/base.orm-entities';
import { ExchangeRateOrmEntity } from 'src/modules/exchange-rates/entities/exchange-rate.orm-entity';
import { CustomerOrderItemOrmEntity } from './customer-order-item.orm-entity';
export declare class OrderItemSkuOrmEntity extends BaseOrmEntity {
    orderItemSkuIndex: number | null;
    customerOrderItems: CustomerOrderItemOrmEntity[];
    orderItem: OrderItemOrmEntity;
    exchangeRateBuy: ExchangeRateOrmEntity | null;
    exchangeRateSell: ExchangeRateOrmEntity | null;
    variant: string | null;
    quantity: number;
    exchangeRateBuyValue: number | null;
    exchangeRateSellValue: number | null;
    purchasePrice: number;
    purchaseTotal: number;
    sellingPriceForeign: number;
    sellingTotal: number;
    profit: number;
}
