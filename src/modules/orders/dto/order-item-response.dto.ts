import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderItemSkuResponseDto } from './order-item-sku-response.dto';

export class OrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  orderItemIndex: number | null;

  @ApiPropertyOptional({ nullable: true })
  imageId: number | null;

  @ApiPropertyOptional({ nullable: true })
  image: {
    id: number;
    publicUrl: string | null;
    fileName: string;
    originalName: string;
  } | null;

  @ApiPropertyOptional({ nullable: true })
  discountType: string | null;

  @ApiPropertyOptional({ nullable: true })
  discountValue: string | null;

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
  shippingExchangeRate: {
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
  quantity: number;

  @ApiProperty()
  purchaseTotal: string;

  @ApiProperty()
  shippingTotal: string;

  @ApiProperty()
  totalCostBeforeDiscount: string;

  @ApiProperty()
  discountAmount: string;

  @ApiProperty()
  finalCost: string;

  @ApiProperty()
  sellingTotal: string;

  @ApiProperty()
  profit: string;

  @ApiProperty()
  targetCurrencyPurchasePrice: string;

  @ApiProperty()
  targetCurrencySellingPriceForeign: string;

  @ApiProperty()
  targetCurrencyPurchaseTotal: string;

  @ApiProperty()
  targetCurrencySellingTotal: string;

  @ApiProperty()
  targetCurrencyProfit: string;

  @ApiProperty()
  targetCurrencyDiscountAmount: string;

  @ApiProperty()
  targetCurrencyFinalCost: string;

  @ApiProperty()
  targetCurrencyTotalCostBeforeDiscount: string;

  @ApiProperty()
  targetCurrencyShippingTotal: string;

  @ApiProperty({ type: [OrderItemSkuResponseDto] })
  skus: OrderItemSkuResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
