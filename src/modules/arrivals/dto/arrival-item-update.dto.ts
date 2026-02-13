import { IsOptional, IsInt, IsIn, Min, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CONDITIONS = ['OK', 'DAMAGED', 'LOST'] as const;

export class ArrivalItemUpdateDto {
  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  arrivedQuantity?: number;

  @ApiPropertyOptional({ enum: CONDITIONS })
  @IsOptional()
  @IsIn(CONDITIONS)
  condition?: (typeof CONDITIONS)[number] | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(5000)
  notes?: string | null;
}
