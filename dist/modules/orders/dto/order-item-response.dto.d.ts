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
    discountType: string | null;
    discountValue: string | null;
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
    exchangeRateBuyValue: string | null;
    exchangeRateSellValue: string | null;
    quantity: number;
    purchaseTotal: string;
    shippingTotal: string;
    totalCostBeforeDiscount: string;
    discountAmount: string;
    finalCost: string;
    sellingTotal: string;
    profit: string;
    targetCurrencyPurchasePrice: string;
    targetCurrencySellingPriceForeign: string;
    targetCurrencyPurchaseTotal: string;
    targetCurrencySellingTotal: string;
    targetCurrencyProfit: string;
    targetCurrencyDiscountAmount: string;
    targetCurrencyFinalCost: string;
    targetCurrencyTotalCostBeforeDiscount: string;
    targetCurrencyShippingTotal: string;
    skus: OrderItemSkuResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
