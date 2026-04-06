import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
declare const RATE_TYPES: readonly ["BUY", "SELL"];
export declare class ExchangeRateListQueryDto extends BaseQueryDto {
    merchantId?: number;
    rateType?: (typeof RATE_TYPES)[number];
    baseCurrency?: string;
    targetCurrency?: string;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
}
export type ExchangeRateListQueryOptions = ExchangeRateListQueryDto;
export {};
