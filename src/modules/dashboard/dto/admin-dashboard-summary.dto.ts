import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardSummaryResponseDto {
  @ApiProperty({ description: 'Total number of merchants' })
  totalMerchants: number;

  @ApiProperty({ description: 'Total number of admin users (users without merchantId)' })
  totalAdminUsers: number;

  @ApiProperty({ description: 'Total number of users with merchantId' })
  totalMerchantUsers: number;

  @ApiProperty({ description: 'Total number of orders' })
  totalOrders: number;
}
