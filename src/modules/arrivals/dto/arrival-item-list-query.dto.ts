import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ArrivalItemListQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by arrival ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  arrivalId?: number;

  @ApiPropertyOptional({ description: 'Filter by order item ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderItemId?: number;
}
