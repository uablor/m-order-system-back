import { ApiProperty } from '@nestjs/swagger';
import { ExchangeRateResponseDto } from './exchange-rate-response.dto';

/**
 * Standard wrapper for the GET /exchange-rates/today response.
 *
 * Shape:
 * {
 *   "success": true,
 *   "Code": 200,
 *   "message": "Success",
 *   "results": [ ...ExchangeRateResponseDto ]   // 0–2 items (BUY and/or SELL)
 * }
 */
export class ExchangeRateTodayResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  Code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({
    type: [ExchangeRateResponseDto],
    description:
      'Active exchange rates for today. Contains 0–2 items. ' +
      'Use rateType field ("BUY" | "SELL") to distinguish each item. ' +
      'An empty array means no rates have been set for today.',
    example: [
      {
        id: 1,
        merchantId: 5,
        baseCurrency: 'CNY',
        targetCurrency: 'LAK',
        rateType: 'BUY',
        rate: '24500.000000',
        isActive: true,
        rateDate: '2025-02-18',
        createdBy: 10,
        createdAt: '2025-02-18T08:00:00.000Z',
        updatedAt: '2025-02-18T08:00:00.000Z',
      },
      {
        id: 2,
        merchantId: 5,
        baseCurrency: 'CNY',
        targetCurrency: 'LAK',
        rateType: 'SELL',
        rate: '25000.000000',
        isActive: true,
        rateDate: '2025-02-18',
        createdBy: 10,
        createdAt: '2025-02-18T08:00:00.000Z',
        updatedAt: '2025-02-18T08:00:00.000Z',
      },
    ],
  })
  results: ExchangeRateResponseDto[];
}
