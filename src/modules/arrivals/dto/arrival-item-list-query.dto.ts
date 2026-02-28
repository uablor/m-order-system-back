import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusSend } from 'src/modules/notifications/enum/status-send.enum';

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

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by created by user ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  createdByUserId?: number;

  @ApiPropertyOptional({ enum: StatusSend, description: 'Filter by status sent' })
  @IsOptional()
  @IsEnum(StatusSend)
  statusSent?: StatusSend;
}
