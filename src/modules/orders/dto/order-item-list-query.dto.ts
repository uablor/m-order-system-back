import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';

export class OrderItemListQueryDto extends BaseQueryDto {

  @ApiPropertyOptional({ description: 'Filter by order ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderId?: number;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  merchantId?: number;
}
