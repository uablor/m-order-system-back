import { IsOptional, IsInt, IsDateString, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';

export enum ArrivalStatusFilter {
  NOT_ARRIVED = 'NOT_ARRIVED',
  ARRIVED = 'ARRIVED',
}

export enum PaymentStatusFilter {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

export class OrderListQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  merchantId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customerId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer name (partial match)' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ArrivalStatusFilter, description: 'Filter by arrival status' })
  @IsOptional()
  @IsEnum(ArrivalStatusFilter)
  arrivalStatus?: ArrivalStatusFilter;

  @ApiPropertyOptional({ enum: PaymentStatusFilter, description: 'Filter by payment status' })
  @IsOptional()
  @IsEnum(PaymentStatusFilter)
  paymentStatus?: PaymentStatusFilter;
}
