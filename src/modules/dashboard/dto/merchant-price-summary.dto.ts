import { ApiProperty } from '@nestjs/swagger';

export class MerchantPriceSummaryResponseDto {
  @ApiProperty({ description: 'Total price from order items (all)' })
  totalOrderItemsPrice: number;

  @ApiProperty({ description: 'Total price from order items with UNPAID orders' })
  totalOrderItemsPriceUnpaid: number;

  @ApiProperty({ description: 'Total price from order items with PAID orders' })
  totalOrderItemsPricePaid: number;

  @ApiProperty({ description: 'Total final cost from order items with PAID orders' })
  totalOrderItemsFinalCostPaid: number;

  @ApiProperty({ description: 'Total price from payments (all)' })
  totalPaymentsPrice: number;

  @ApiProperty({ description: 'Total price from payments with REJECTED status' })
  totalPaymentsPriceRejected: number;

  @ApiProperty({ description: 'Total price from payments with PENDING VERIFIED status' })
  totalPaymentsPricePendingVerified: number;

  @ApiProperty({ description: 'Total price from payments with PENDING REJECTED status' })
  totalPaymentsPricePendingRejected: number;

  @ApiProperty({ description: 'Total final cost (all)' })
  totalFinalCost: number;

  @ApiProperty({ description: 'Total shipping price (all)' })
  totalShippingPrice: number;

  @ApiProperty({ description: 'Total final cost with PAID orders' })
  totalFinalCostPaid: number;

  @ApiProperty({ description: 'Total shipping price with PAID orders' })
  totalShippingPricePaid: number;
}
