import { IsString, IsOptional, IsBoolean, IsIn, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const RATE_TYPES = ['BUY', 'SELL'] as const;

export class ExchangeRateUpdateDto {
  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  baseCurrency?: string;

  @ApiPropertyOptional({ example: 'LAK' })
  @IsOptional()
  @IsString()
  targetCurrency?: string;

  @ApiPropertyOptional({ enum: RATE_TYPES })
  @IsOptional()
  @IsIn(RATE_TYPES)
  rateType?: (typeof RATE_TYPES)[number];

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @ApiPropertyOptional({ example: '2025-02-13' })
  @IsOptional()
  @IsDateString()
  rateDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
