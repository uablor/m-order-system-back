import { IsOptional, IsInt, Min, Max, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';


export class TokenQueryDto {
  @ApiPropertyOptional({ description: 'Filter by customer unique token' })
  @IsOptional()
  @IsString()
  customerToken?: string;

  @ApiPropertyOptional({ description: 'Filter by notification token' })
  @IsOptional()
  @IsString()
  notificationToken?: string;
}

export class CustomerOrderListQueryDto extends IntersectionType(
  BaseQueryDto,
  TokenQueryDto,
) {
  @ApiPropertyOptional({ description: 'Filter by notification status (null = no notification created)' })
  @IsOptional()
  @IsString()
  notificationStatus?: string;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  merchantId?: number;

  @ApiPropertyOptional({ description: 'Filter by order ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderId?: number;

  @ApiPropertyOptional({ description: 'Filter by order code (partial match)', example: 'ORD-001' })
  @IsOptional()
  @IsString()
  orderCode?: string;

  @ApiPropertyOptional({ description: 'Filter by customer order ID (the # shown to customer)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customerOrderId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customerId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer name (partial match)' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Filter by arrival status (true = arrived, false = not arrived)' })
  @IsOptional()
  @IsBoolean()
  isArrived?: boolean;

  @ApiPropertyOptional({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by payment status' })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

}
