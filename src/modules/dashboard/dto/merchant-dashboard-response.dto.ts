import { ApiProperty } from '@nestjs/swagger';
import { OrdersByArrivalStatusDto, OrdersByPaymentStatusDto } from './common-dashboard.dto';

export class LatestOrderDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ORD-20260220-001' })
  orderCode: string;

  @ApiProperty({ example: 'NOT_ARRIVED', enum: ['NOT_ARRIVED', 'ARRIVED'] })
  arrivalStatus: string;

  @ApiProperty({ example: '1500000.00', description: 'Total amount customer needs to pay (totalSellingAmountLak)' })
  totalAmount: string;

  @ApiProperty({ example: 'ລູກຄ້າ ທີ 1', nullable: true })
  customerName: string | null;
}

export class MerchantDashboardResponseDto {
  @ApiProperty()
  merchantId: number;

  @ApiProperty()
  shopName: string;

  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalOrdersThisMonth: number;

  @ApiProperty({ type: () => OrdersByPaymentStatusDto })
  ordersByPaymentStatus: OrdersByPaymentStatusDto;

  @ApiProperty({ type: () => OrdersByArrivalStatusDto })
  ordersByArrivalStatus: OrdersByArrivalStatusDto;

  @ApiProperty()
  totalCustomers: number;

  @ApiProperty()
  totalArrivals: number;

  @ApiProperty()
  totalFinalCost: string;

  @ApiProperty()
  totalRevenue: string;

  @ApiProperty()
  totalProfit: string;

  @ApiProperty()
  totalOutstandingAmount: string;

  @ApiProperty({ type: [LatestOrderDto], description: 'Latest 5 orders with customer name' })
  latestOrders: LatestOrderDto[];
}
