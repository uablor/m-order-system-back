import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CustomerOrderItemResponseDto {
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
  sellingPriceForeign: string;

  @ApiProperty()
  sellingTotal: string;

  @ApiPropertyOptional({ nullable: true })
  targetCurrencySellingTotal: string | null;

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

  @ApiPropertyOptional({ description: 'Target currency from order exchange rate (e.g. THB, LAK)' })
  targetCurrency: string | null;

  @ApiPropertyOptional({ description: 'Total selling amount in target currency' })
  targetCurrencyTotalSellingAmount: string | null;

  @ApiPropertyOptional({ description: 'Total paid in target currency' })
  targetCurrencyTotalPaid: string | null;

  @ApiPropertyOptional({ description: 'Remaining amount in target currency' })
  targetCurrencyRemainingAmount: string | null;

  @ApiProperty({ description: 'Whether there is a payment with status PENDING awaiting verification' })
  hasPendingPayment: boolean;

  @ApiProperty({ type: [CustomerOrderItemResponseDto] })
  customerOrderItems: CustomerOrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
