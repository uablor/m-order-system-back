declare const RATE_TYPES: readonly ["BUY", "SELL"];
export declare class ExchangeRateUpdateDto {
    baseCurrency?: string;
    targetCurrency?: string;
    rateType?: (typeof RATE_TYPES)[number];
    rate?: number;
    rateDate?: string;
    isActive?: boolean;
}
export {};
