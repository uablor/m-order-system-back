import { IsString, IsNumber, IsOptional, IsIn, Min, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ARRIVAL_STATUSES = ['NOT_ARRIVED', 'ARRIVED'] as const;

export class OrderCreateDto {
  @ApiProperty()
  @IsNumber()
  merchantId: number;

  @ApiProperty({ example: 'ORD-001' })
  @IsString()
  @MaxLength(100)
  orderCode: string;

  @ApiProperty({ example: '2025-02-11' })
  @IsDateString()
  orderDate: string;

  @ApiPropertyOptional({ enum: ARRIVAL_STATUSES, default: 'NOT_ARRIVED' })
  @IsOptional()
  @IsIn(ARRIVAL_STATUSES)
  arrivalStatus?: 'NOT_ARRIVED' | 'ARRIVED';

  @ApiPropertyOptional({ description: 'Total shipping cost', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalShippingCost?: number;
}
