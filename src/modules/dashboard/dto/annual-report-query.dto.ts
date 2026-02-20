import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnnualReportQueryDto {
  @ApiPropertyOptional({ description: 'ปีที่ต้องการดูรายงาน (default = ปีปัจจุบัน)', example: 2025 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;
}
