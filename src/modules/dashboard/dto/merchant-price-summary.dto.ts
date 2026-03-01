import { ApiProperty } from '@nestjs/swagger';

export class MerchantPriceSummaryResponseDto {
  @ApiProperty({ description: 'Total price in order items' })
  totalOrderItemsPrice: number;

  @ApiProperty({ description: 'Total price of unpaid order items' })
  totalUnpaidOrderItemsPrice: number;

  @ApiProperty({ description: 'Total price of paid order items' })
  totalPaidOrderItemsPrice: number;

  @ApiProperty({ description: 'Total final cost of paid order items' })
  totalPaidOrderItemsFinalCost: number;

  @ApiProperty({ description: 'Total price in payments (all statuses)' })
  totalPaymentsPrice: number;

  @ApiProperty({ description: 'Total price of rejected payments' })
  totalRejectedPaymentsPrice: number;

  @ApiProperty({ description: 'Total price of pending verified payments' })
  totalPendingVerifiedPaymentsPrice: number;

  @ApiProperty({ description: 'Total price of pending rejected payments' })
  totalPendingRejectedPaymentsPrice: number;

  @ApiProperty({ description: 'Total final cost' })
  totalFinalCost: number;

  @ApiProperty({ description: 'Total shipping price' })
  totalShippingPrice: number;

  @ApiProperty({ description: 'Total final cost of paid items' })
  totalPaidFinalCost: number;

  @ApiProperty({ description: 'Total shipping price of paid items' })
  totalPaidShippingPrice: number;
}
