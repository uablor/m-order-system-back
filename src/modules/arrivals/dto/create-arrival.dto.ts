import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsIn,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CONDITIONS = ['OK', 'DAMAGED', 'LOST'] as const;

export class CreateArrivalItemDto {
  @ApiProperty({ description: 'Order item ID' })
  @IsNumber()
  orderItemId: number;

  @ApiProperty({ description: 'Quantity arrived', minimum: 1 })
  @IsNumber()
  @Min(1)
  arrivedQuantity: number;

  @ApiPropertyOptional({ enum: CONDITIONS })
  @IsOptional()
  @IsIn(CONDITIONS)
  condition?: 'OK' | 'DAMAGED' | 'LOST';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateArrivalDto {
  @ApiProperty({ description: 'Order ID' })
  @IsNumber()
  orderId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateArrivalItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArrivalItemDto)
  arrivalItems: CreateArrivalItemDto[];
}
