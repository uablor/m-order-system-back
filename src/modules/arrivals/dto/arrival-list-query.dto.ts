import { IsOptional, IsInt, IsDateString, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
import { StatusSend } from 'src/modules/notifications/enum/status-send.enum';

export class ArrivalListQueryDto extends BaseQueryDto {
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

  @ApiPropertyOptional({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by created by user ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  createdByUserId?: number;

  @ApiPropertyOptional({ description: 'Filter by arrival date (YYYY-MM-DD)', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  arrivalDate?: string;

  @ApiPropertyOptional({ description: 'Filter by arrival time (HH:mm)', example: '14:30' })
  @IsOptional()
  @IsString()
  arrivalTime?: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Filter by arrival', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  arrival?: boolean;
}

