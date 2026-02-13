import { IsOptional, IsDateString, IsInt, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ArrivalUpdateDto {
  @ApiPropertyOptional({ example: '2025-02-11' })
  @IsOptional()
  @IsDateString()
  arrivedDate?: string;

  @ApiPropertyOptional({ example: '14:30:00', description: 'Time of arrival (HH:mm:ss)' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, { message: 'arrivedTime must be HH:mm:ss' })
  arrivedTime?: string;

  @ApiPropertyOptional({ description: 'User ID who recorded the arrival' })
  @IsOptional()
  @IsInt()
  recordedBy?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(5000)
  notes?: string | null;
}
