import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArrivalItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  arrivalId: number;

  @ApiProperty()
  orderItemId: number;

  @ApiPropertyOptional()
  orderItem?: {
    id: number;
    productName: string;
    variant: string | null;
    quantity: number;
  } | null;

  @ApiProperty()
  arrivedQuantity: number;

  @ApiPropertyOptional({ nullable: true })
  condition: string | null;

  @ApiPropertyOptional({ nullable: true })
  notes: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ArrivalResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiPropertyOptional()
  order?: {
    id: number;
    orderCode: string;
    orderDate: string;
  } | null;

  @ApiProperty()
  merchantId: number;

  @ApiProperty({ example: '2025-02-11' })
  arrivedDate: string;

  @ApiProperty({ example: '14:30:00' })
  arrivedTime: string;

  @ApiPropertyOptional({ nullable: true })
  recordedBy: number | null;

  @ApiPropertyOptional({ nullable: true })
  recordedByUser?: {
    id: number;
    fullName: string;
    email: string;
  } | null;

  @ApiPropertyOptional({ nullable: true })
  notes: string | null;

  @ApiPropertyOptional({ type: () => [ArrivalItemResponseDto] })
  arrivalItems?: ArrivalItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
