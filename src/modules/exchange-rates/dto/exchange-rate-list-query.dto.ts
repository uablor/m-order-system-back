import { IsOptional, IsInt, Min, Max, IsIn, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';

const RATE_TYPES = ['BUY', 'SELL'] as const;

export class ExchangeRateListQueryDto extends BaseQueryDto {

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

  @ApiPropertyOptional({ description: 'format YYYY-MM-DD' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'format YYYY-MM-DD' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

export type ExchangeRateListQueryOptions = ExchangeRateListQueryDto;