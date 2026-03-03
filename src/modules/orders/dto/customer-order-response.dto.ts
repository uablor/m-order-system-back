import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatusEnum } from '../enum/enum.entities';

class CustomerOrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderItemId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  variant: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  exchangeRateBuy: {
    id: number;
    baseCurrency: string;
    targetCurrency: string;
    rate: number;
    rateType: string;
    rateDate: Date;
    isActive: boolean;
  } | null;
  
  @ApiProperty()
  exchangeRateSell: {
    id: number;
    baseCurrency: string;
    targetCurrency: string;
    rate: number;
    rateType: string;
    rateDate: Date;
    isActive: boolean;
  } | null;
  
  @ApiProperty()
  exchangeRateBuyValue: number | null;
  
  @ApiProperty()
  exchangeRateSellValue: number | null;
  
  @ApiProperty()
  image: {
    originalName: string;
    fileName: string;
    filePath: string;
    fileKey: string;
    fileSize: number;
    mimeType: string;
    publicUrl: string | null;
    isActive: boolean;
    tags: string[] | null;
    description: string | null;
  } | null;

  @ApiProperty()
  sellingPriceForeign: number;

  @ApiProperty()
  sellingTotal: number;

  @ApiProperty()
  targetCurrencySellingPriceForeign: number;

  @ApiProperty()
  targetCurrencySellingTotal: number;
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
  totalSellingAmount: number;

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  remainingAmount: number;

    @ApiProperty()
  targetCurrencyTotalSellingAmount: number;

  @ApiProperty()
  targetCurrencyTotalPaid: number;

  @ApiProperty()
  targetCurrencyRemainingAmount: number;

  @ApiProperty()
  paymentStatus: PaymentStatusEnum;

  @ApiProperty({ type: [CustomerOrderItemResponseDto] })
  customerOrderItems: CustomerOrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
