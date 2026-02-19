import {
  IsString,
  IsIn,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const RATE_TYPES = ['BUY', 'SELL'] as const;

export class ExchangeRateCreateDto {
  @ApiProperty({ example: 'USD', description: 'Base currency code' })
  @IsString()
  baseCurrency: string;

  @ApiProperty({ example: 'LAK', description: 'Target currency code' })
  @IsString()
  targetCurrency: string;

  @ApiProperty({ enum: RATE_TYPES, description: 'BUY or SELL rate' })
  @IsIn(RATE_TYPES)
  rateType: (typeof RATE_TYPES)[number];

  @ApiProperty({ example: 25000, description: 'Exchange rate value' })
  @IsNumber()
  @Min(0)
  rate: number;
}

export class ExchangeRateCreateManyDto {
  @ApiProperty({
    type: [ExchangeRateCreateDto],
    description: 'List of exchange rates',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExchangeRateCreateDto)
  items: ExchangeRateCreateDto[];
}
