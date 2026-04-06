export declare class MerchantPriceCurrencySummaryDto {
    targetCurrency: string;
    totalAll: number;
    totalUnpaid: number;
    totalPaid: number;
    totalAllConverted?: number;
    totalUnpaidConverted?: number;
    totalPaidConverted?: number;
}
export declare class MerchantGetPriceCurrencySummaryDto {
    startDate?: Date;
    endDate?: Date;
    merchantId?: number;
}
