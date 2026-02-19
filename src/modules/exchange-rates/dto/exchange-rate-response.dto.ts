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

  constructor(partial: Partial<ExchangeRateResponseDto>) {
    this.id = partial.id ?? 0;
    this.merchantId = partial.merchantId ?? 0;
    this.baseCurrency = partial.baseCurrency ?? '';
    this.targetCurrency = partial.targetCurrency ?? '';
    this.rateType = partial.rateType ?? 'BUY';
    this.rate = partial.rate ?? '';
    this.isActive = partial.isActive ?? false;
    this.rateDate = partial.rateDate ?? '';
    this.createdBy = partial.createdBy ?? null;
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }
}
