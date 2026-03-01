import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';


export class ArrivalItemListQueryDto extends BaseQueryDto {
 
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

  @ApiPropertyOptional({ description: 'Filter by created by user ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  createdByUserId?: number;
}
