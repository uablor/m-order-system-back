import { IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const RATE_TYPES = ['BUY', 'SELL'] as const;

export class ExchangeRateListQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  merchantId?: number;

  @ApiPropertyOptional({ enum: RATE_TYPES })
  @IsOptional()
  @IsIn(RATE_TYPES)
  rateType?: (typeof RATE_TYPES)[number];

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  baseCurrency?: string;

  @ApiPropertyOptional({ example: 'LAK' })
  @IsOptional()
  targetCurrency?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
