import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArrivalItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  arrivalId: number;

  @ApiProperty()
  orderItemId: number;

  @ApiProperty()
  arrivedQuantity: number;

  @ApiPropertyOptional({ enum: ['OK', 'DAMAGED', 'LOST'], nullable: true })
  condition: string | null;

  @ApiPropertyOptional({ nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
