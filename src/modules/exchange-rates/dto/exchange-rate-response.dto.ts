import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExchangeRateResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  merchantId: number;

  @ApiProperty({ example: 'USD' })
  baseCurrency: string;

  @ApiProperty({ example: 'LAK' })
  targetCurrency: string;

  @ApiProperty({ enum: ['BUY', 'SELL'] })
  rateType: string;

  @ApiProperty()
  rate: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ example: '2025-02-13' })
  rateDate: string;

  @ApiPropertyOptional({ nullable: true })
  createdBy: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
