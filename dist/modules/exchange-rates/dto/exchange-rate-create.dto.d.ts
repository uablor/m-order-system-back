declare const RATE_TYPES: readonly ["BUY", "SELL"];
export declare class ExchangeRateCreateDto {
    baseCurrency: string;
    targetCurrency: string;
    rateType: (typeof RATE_TYPES)[number];
    rate: number;
}
export declare class ExchangeRateCreateManyDto {
    items: ExchangeRateCreateDto[];
}
export {};
