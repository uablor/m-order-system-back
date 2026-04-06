import { ExchangeRateResponseDto } from './exchange-rate-response.dto';
export declare class ExchangeRateTodayResponseDto {
    success: boolean;
    Code: number;
    message: string;
    results: ExchangeRateResponseDto[];
}
