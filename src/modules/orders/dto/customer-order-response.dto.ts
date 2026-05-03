import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatusEnum } from '../../payments/enum/payment.enum';

class CustomerOrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderItemSkuId: number;

  @ApiProperty()
  variant: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  sellingPriceForeign: number;

  @ApiProperty()
  purchasePrice: number;

  @ApiProperty()
  purchaseTotal: number;

  @ApiProperty()
  sellingTotal: number;

  @ApiProperty()
  profit: number;

  @ApiProperty({ required: false })
  productName: string | null;

  @ApiProperty({ required: false })
  orderItemId: number | null;
}

export class CustomerOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty({ description: 'Order code from order table (e.g. ORD-001)' })
  orderCode: string | null;

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

  @ApiProperty({ description: 'Whether this order has a pending payment waiting for approval' })
  hasPendingPayment: boolean;

  @ApiProperty({ description: 'Discount type: PERCENT or FIX', required: false, nullable: true })
  discountType: string | null;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)', required: false, nullable: true })
  discountValue: number | null;

  @ApiProperty({ description: 'Calculated discount amount', required: false })
  discountAmount: number;

  @ApiProperty({ type: [CustomerOrderItemResponseDto] })
  customerOrderItems: CustomerOrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
