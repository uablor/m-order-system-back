import { ApiProperty } from '@nestjs/swagger';

export class MerchantSummaryResponseDto {
  @ApiProperty({ description: 'Total users with this merchant' })
  totalUsers: number;

  @ApiProperty({ description: 'Total customers with this merchant' })
  totalCustomers: number;

  @ApiProperty({ description: 'Total orders with this merchant' })
  totalOrders: number;

  @ApiProperty({ description: 'Total paid orders with this merchant' })
  totalPaidOrders: number;

  @ApiProperty({ description: 'Total arrivals with this merchant' })
  totalArrivals: number;

  @ApiProperty({ description: 'Total order items with this merchant' })
  totalOrderItems: number;
}
