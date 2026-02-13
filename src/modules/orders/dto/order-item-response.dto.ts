import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  productName: string;

  @ApiPropertyOptional({ nullable: true })
  variant: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantityRemaining: number;

  @ApiProperty()
  purchaseCurrency: string;

  @ApiProperty()
  purchasePrice: string;

  @ApiProperty()
  purchaseExchangeRate: string;

  @ApiProperty()
  purchaseTotalLak: string;

  @ApiProperty()
  totalCostBeforeDiscountLak: string;

  @ApiPropertyOptional({ nullable: true })
  discountType: string | null;

  @ApiPropertyOptional({ nullable: true })
  discountValue: string | null;

  @ApiProperty()
  discountAmountLak: string;

  @ApiProperty()
  finalCostLak: string;

  @ApiProperty()
  finalCostThb: string;

  @ApiProperty()
  sellingPriceForeign: string;

  @ApiProperty()
  sellingExchangeRate: string;

  @ApiProperty()
  sellingTotalLak: string;

  @ApiProperty()
  profitLak: string;

  @ApiProperty()
  profitThb: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
