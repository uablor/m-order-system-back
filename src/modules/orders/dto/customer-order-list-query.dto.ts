import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';

export class CustomerOrderListQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by order ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customerId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer name (partial match)' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Filter by customer unique token' })
  @IsOptional()
  @IsString()
  customerToken?: string;

  @ApiPropertyOptional({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
