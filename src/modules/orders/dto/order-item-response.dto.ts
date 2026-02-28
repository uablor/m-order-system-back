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

  @ApiPropertyOptional({ nullable: true })
  exchangeRateBuy: {
    id: number;
    baseCurrency: string;
    targetCurrency: string;
    rate: string;
    rateType: string;
    rateDate: Date;
    isActive: boolean;
  } | null;

  @ApiPropertyOptional({ nullable: true })
  exchangeRateSell: {
    id: number;
    baseCurrency: string;
    targetCurrency: string;
    rate: string;
    rateType: string;
    rateDate: Date;
    isActive: boolean;
  } | null;

  @ApiProperty()
  exchangeRateBuyValue: string | null;

  @ApiPropertyOptional({ nullable: true })
  exchangeRateSellValue: string | null;

  @ApiProperty()
  purchasePrice: string;

  @ApiProperty()
  purchaseTotal: string;

  @ApiPropertyOptional({ nullable: true })
  shippingPrice: string | null;

  @ApiProperty()
  totalCostBeforeDiscount: string;

  @ApiPropertyOptional({ nullable: true })
  discountType: string | null;

  @ApiPropertyOptional({ nullable: true })
  discountValue: string | null;

  @ApiProperty()
  discountAmount: string;

  @ApiProperty()
  finalCost: string;

  @ApiProperty()
  sellingPriceForeign: string;

  @ApiProperty()
  sellingTotal: string;

  @ApiProperty()
  profit: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
