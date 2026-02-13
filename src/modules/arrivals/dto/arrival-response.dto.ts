import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArrivalResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  merchantId: number;

  @ApiProperty({ example: '2025-02-11' })
  arrivedDate: string;

  @ApiProperty({ example: '14:30:00' })
  arrivedTime: string;

  @ApiPropertyOptional({ nullable: true })
  recordedBy: number | null;

  @ApiPropertyOptional({ nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
