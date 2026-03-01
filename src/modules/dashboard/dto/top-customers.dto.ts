import { ApiProperty } from '@nestjs/swagger';

export class TopCustomerDto {
  @ApiProperty({ description: 'Customer rank (1-5)' })
  rank: number;

  @ApiProperty({ description: 'Customer ID' })
  customerId: number;

  @ApiProperty({ description: 'Customer full name' })
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  customerEmail: string;

  @ApiProperty({ description: 'Total buy amount (in LAK)' })
  totalBuyAmountLak: number;

  @ApiProperty({ description: 'Number of orders' })
  orderCount: number;

  @ApiProperty({ description: 'Average order amount (in LAK)' })
  averageOrderAmountLak: number;
}

export class TopCustomersResponseDto {
  @ApiProperty({ description: 'Array of top 5 customers', type: [TopCustomerDto] })
  customers: TopCustomerDto[];
}
