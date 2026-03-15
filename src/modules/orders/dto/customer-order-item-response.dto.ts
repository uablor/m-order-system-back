import { ApiProperty } from '@nestjs/swagger';

export class CustomerOrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  customerOrderId: number;

  @ApiProperty()
  orderItemSkuId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  sellingPriceForeign: string;

  @ApiProperty()
  purchasePrice: string;

  @ApiProperty()
  purchaseTotal: string;

  @ApiProperty()
  sellingTotal: string;

  @ApiProperty()
  profit: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
