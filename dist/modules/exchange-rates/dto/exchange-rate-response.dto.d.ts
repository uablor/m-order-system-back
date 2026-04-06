export declare class ExchangeRateResponseDto {
    id: number;
    merchantId: number;
    baseCurrency: string;
    targetCurrency: string;
    rateType: string;
    rate: string;
    isActive: boolean;
    rateDate: string;
    createdBy: number | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ExchangeRateResponseDto>);
}
