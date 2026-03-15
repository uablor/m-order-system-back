import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemSkuResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderItemId: number;

  @ApiPropertyOptional({ nullable: true })
  orderItemSkuIndex: number | null;

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

  @ApiPropertyOptional({ nullable: true })
  exchangeRateBuyValue: string | null;

  @ApiPropertyOptional({ nullable: true })
  exchangeRateSellValue: string | null;

  @ApiProperty()
  purchasePrice: string;

  @ApiProperty()
  purchaseTotal: string;

  @ApiProperty()
  sellingPriceForeign: string;

  @ApiProperty()
  sellingTotal: string;

  @ApiProperty()
  profit: string;

  @ApiPropertyOptional({ nullable: true })
  targetCurrencyPurchaseTotal: string;

  @ApiPropertyOptional({ nullable: true })
  targetCurrencyPurchasePrice: string;

  @ApiPropertyOptional({ nullable: true })
  targetCurrencySellingPriceForeign: string;

  @ApiPropertyOptional({ nullable: true })
  targetCurrencySellingTotal: string;

  @ApiPropertyOptional({ nullable: true })
  targetCurrencyProfit: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
