import { IsOptional, IsIn, IsInt, Min, IsDateString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusSend } from '../enum/status-send.enum';

const STATUSES = ['SENT', 'FAILED'] as const;
const STATUS_SEND_VALUES = Object.values(StatusSend);

export class NotificationUpdateDto {
  @ApiPropertyOptional({ enum: STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @ApiPropertyOptional({ enum: STATUS_SEND_VALUES })
  @IsOptional()
  @IsIn(STATUS_SEND_VALUES)
  statusSent?: StatusSend;

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
