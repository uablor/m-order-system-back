export declare class OrderItemSkuResponseDto {
    id: number;
    orderItemId: number;
    orderItemSkuIndex: number | null;
    variant: string | null;
    quantity: number;
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
    purchasePrice: string;
    purchaseTotal: string;
    sellingPriceForeign: string;
    sellingTotal: string;
    profit: string;
    targetCurrencyPurchaseTotal: string;
    targetCurrencyPurchasePrice: string;
    targetCurrencySellingPriceForeign: string;
    targetCurrencySellingTotal: string;
    targetCurrencyProfit: string;
    createdAt: Date;
    updatedAt: Date;
}
