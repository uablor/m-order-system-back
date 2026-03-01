import { ApiProperty } from '@nestjs/swagger';

class CustomerOrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  sellingPriceForeign: string;

  @ApiProperty()
  sellingTotal: string;

  @ApiProperty()
  profit: string;
}

export class CustomerOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerToken: string;

  @ApiProperty()
  totalSellingAmount: string;

  @ApiProperty()
  totalPaid: string;

  @ApiProperty()
  remainingAmount: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty({ type: [CustomerOrderItemResponseDto] })
  customerOrderItems: CustomerOrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
