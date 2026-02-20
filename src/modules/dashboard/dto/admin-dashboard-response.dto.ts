import { ApiProperty } from '@nestjs/swagger';

export class OrdersByPaymentStatusDto {
  @ApiProperty()
  UNPAID: number;

  @ApiProperty()
  PARTIAL: number;

  @ApiProperty()
  PAID: number;
}

export class OrdersByArrivalStatusDto {
  @ApiProperty()
  NOT_ARRIVED: number;

  @ApiProperty()
  ARRIVED: number;
}

export class AdminDashboardResponseDto {
  @ApiProperty()
  totalMerchants: number;

  @ApiProperty()
  activeMerchants: number;

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalCustomers: number;

  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalOrdersThisMonth: number;

  @ApiProperty({ type: () => OrdersByPaymentStatusDto })
  ordersByPaymentStatus: OrdersByPaymentStatusDto;

  @ApiProperty({ type: () => OrdersByArrivalStatusDto })
  ordersByArrivalStatus: OrdersByArrivalStatusDto;

  @ApiProperty()
  totalFinalCostLak: string;

  @ApiProperty()
  totalRevenueLak: string;

  @ApiProperty()
  totalRevenueThb: string;

  @ApiProperty()
  totalProfitLak: string;

  @ApiProperty()
  totalProfitThb: string;

  @ApiProperty()
  totalOutstandingAmountLak: string;
}
