import { IsOptional, IsIn, IsInt, Min, IsDateString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationStatus } from '../enum/notification.enum';

export class NotificationUpdateDto {
  @ApiPropertyOptional({ enum: NotificationStatus })
  @IsOptional()
  @IsIn(Object.values(NotificationStatus))
  status?: NotificationStatus;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  retryCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastRetryAt?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  sentAt?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(2000)
  errorMessage?: string | null;
}
