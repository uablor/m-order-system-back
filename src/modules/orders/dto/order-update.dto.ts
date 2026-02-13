import { IsString, IsNumber, IsOptional, IsIn, IsDateString, Min, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const ARRIVAL_STATUSES = ['NOT_ARRIVED', 'ARRIVED'] as const;
const PAYMENT_STATUSES = ['UNPAID', 'PARTIAL', 'PAID'] as const;

export class OrderUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  orderCode?: string;

  @ApiPropertyOptional({ example: '2025-02-11' })
  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @ApiPropertyOptional({ enum: ARRIVAL_STATUSES })
  @IsOptional()
  @IsIn(ARRIVAL_STATUSES)
  arrivalStatus?: 'NOT_ARRIVED' | 'ARRIVED';

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  arrivedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  notifiedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalShippingCostLak?: number;

  @ApiPropertyOptional({ enum: PAYMENT_STATUSES })
  @IsOptional()
  @IsIn(PAYMENT_STATUSES)
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number;
}
