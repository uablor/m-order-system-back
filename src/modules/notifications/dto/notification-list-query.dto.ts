import { IsOptional, IsInt, Min, Max, IsIn, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const NOTIFICATION_TYPES = ['ARRIVAL', 'PAYMENT', 'REMINDER'] as const;
const STATUSES = ['SENT', 'FAILED'] as const;

export class NotificationListQueryDto {
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

  @ApiPropertyOptional({ enum: NOTIFICATION_TYPES })
  @IsOptional()
  @IsIn(NOTIFICATION_TYPES)
  notificationType?: (typeof NOTIFICATION_TYPES)[number];

  @ApiPropertyOptional({ enum: STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @ApiPropertyOptional({ description: 'Search by recipient contact or message content' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter from date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter to date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
