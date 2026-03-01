import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class MerchantPriceCurrencySummaryDto {
  @ApiProperty({ description: 'Target currency code' })
  targetCurrency: string;

  @ApiProperty({ description: 'Total price for all orders (in original currency)' })
  totalAll: number;

  @ApiProperty({ description: 'Total price for unpaid orders (in original currency)' })
  totalUnpaid: number;

  @ApiProperty({ description: 'Total price for paid orders (in original currency)' })
  totalPaid: number;

  @ApiProperty({ description: 'Total price for all orders (converted to LAK)' })
  totalAllConverted?: number;

  @ApiProperty({ description: 'Total price for unpaid orders (converted to LAK)' })
  totalUnpaidConverted?: number;

  @ApiProperty({ description: 'Total price for paid orders (converted to LAK)' })
  totalPaidConverted?: number;
}

export class MerchantGetPriceCurrencySummaryDto {
  @ApiProperty({ description: 'Start date', required: false })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  startDate?: Date;
  
  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  endDate?: Date;
}