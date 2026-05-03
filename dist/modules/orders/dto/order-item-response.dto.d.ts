import { OrderItemSkuResponseDto } from './order-item-sku-response.dto';
export declare class OrderItemResponseDto {
    id: number;
    orderId: number;
    productName: string;
    orderItemIndex: number | null;
    imageId: number | null;
    image: {
        id: number;
        publicUrl: string | null;
        fileName: string;
        originalName: string;
    } | null;
    exchangeRateBuy: {
        id: number;
        baseCurrency: string;
        targetCurrency: string;
        rate: string;
        rateType: string;
        rateDate: Date;
        isActive: boolean;
    } | null;
    exchangeRateSell: {
        id: number;
        baseCurrency: string;
        targetCurrency: string;
        rate: string;
        rateType: string;
        rateDate: Date;
        isActive: boolean;
    } | null;
    shippingExchangeRate: {
        id: number;
        baseCurrency: string;
        targetCurrency: string;
        rate: string;
        rateType: string;
        rateDate: Date;
        isActive: boolean;
    } | null;
    exchangeRateBuyValue: string | null;
    exchangeRateSellValue: string | null;
    quantity: number;
    purchaseTotal: string;
    finalCost: string;
    sellingTotal: string;
    profit: string;
    targetCurrencyPurchasePrice: string;
    targetCurrencySellingPriceForeign: string;
    targetCurrencyPurchaseTotal: string;
    targetCurrencySellingTotal: string;
    targetCurrencyProfit: string;
    targetCurrencyFinalCost: string;
    skus: OrderItemSkuResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
