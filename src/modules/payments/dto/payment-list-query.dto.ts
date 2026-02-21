import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueryDto } from '../../../common/base/dtos/base.query.dto';

export class PaymentListQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by payment status (PENDING/VERIFIED/REJECTED)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by customer order ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  customerOrderId?: number;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  customerId?: number;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  merchantId?: number;

  @ApiPropertyOptional({ description: 'Filter by payment date range (start)' })
  @IsOptional()
  @Type(() => Date)
  paymentDateFrom?: Date;

  @ApiPropertyOptional({ description: 'Filter by payment date range (end)' })
  @IsOptional()
  @Type(() => Date)
  paymentDateTo?: Date;
}
