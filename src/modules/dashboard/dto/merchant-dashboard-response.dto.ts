import { ApiProperty } from '@nestjs/swagger';
import { OrdersByArrivalStatusDto, OrdersByPaymentStatusDto } from './admin-dashboard-response.dto';

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
