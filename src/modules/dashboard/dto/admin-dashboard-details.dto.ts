import { ApiProperty } from '@nestjs/swagger';

export class TopMerchantDto {
  @ApiProperty({ description: 'Merchant ID' })
  id: number;

  @ApiProperty({ description: 'Shop name' })
  shopName: string;

  @ApiProperty({ description: 'Total orders count' })
  totalOrders: number;

  @ApiProperty({ description: 'Total revenue' })
  totalRevenue: string;

  @ApiProperty({ description: 'Total profit' })
  totalProfit: string;
}

export class RecentUserDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Last login timestamp' })
  lastLogin: Date;

  @ApiProperty({ description: 'Merchant associated with user' })
  merchant?: {
    id: number;
    shopName: string;
  };
}

export class AdminDashboardDetailsResponseDto {
  @ApiProperty({ description: 'Top 5 merchants by orders', type: [TopMerchantDto] })
  topMerchants: TopMerchantDto[];

  @ApiProperty({ description: 'Recent 5 user logins', type: [RecentUserDto] })
  recentUserLogins: RecentUserDto[];
}
