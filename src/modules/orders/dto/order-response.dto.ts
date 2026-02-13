import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  merchantId: number;

  @ApiPropertyOptional({ nullable: true })
  createdBy: number | null;

  @ApiProperty()
  orderCode: string;

  @ApiProperty()
  orderDate: string;

  @ApiProperty()
  arrivalStatus: string;

  @ApiPropertyOptional({ nullable: true })
  arrivedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  notifiedAt: Date | null;

  @ApiProperty()
  totalPurchaseCostLak: string;

  @ApiProperty()
  totalShippingCostLak: string;

  @ApiProperty()
  totalCostBeforeDiscountLak: string;

  @ApiProperty()
  totalDiscountLak: string;

  @ApiProperty()
  totalFinalCostLak: string;

  @ApiProperty()
  totalFinalCostThb: string;

  @ApiProperty()
  totalSellingAmountLak: string;

  @ApiProperty()
  totalSellingAmountThb: string;

  @ApiProperty()
  totalProfitLak: string;

  @ApiProperty()
  totalProfitThb: string;

  @ApiProperty()
  depositAmount: string;

  @ApiProperty()
  paidAmount: string;

  @ApiProperty()
  remainingAmount: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
