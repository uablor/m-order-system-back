import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ข้อมูลสรุปทางการเงินแยกตาม baseCurrency
export class MerchantFinancialByCurrencyDto {
  @ApiProperty({ description: 'Base currency code (e.g. THB, USD, CNY)' })
  baseCurrency: string;

  @ApiProperty({ description: 'Number of orders using this currency' })
  totalOrders: number;

  @ApiProperty({ description: 'Total income in LAK (selling amount)' })
  totalIncomeLak: number;

  @ApiProperty({ description: 'Total expense in LAK (final cost)' })
  totalExpenseLak: number;

  @ApiProperty({ description: 'Total profit in LAK' })
  totalProfitLak: number;
}

export class MerchantDetailUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  roleId: number;

  @ApiPropertyOptional()
  roleName?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true })
  lastLogin: Date | null;
}

export class MerchantDetailFinancialDto {
  @ApiProperty({ description: 'Total orders count' })
  totalOrders: number;

  @ApiProperty({ description: 'Orders with UNPAID status' })
  ordersUnpaid: number;

  @ApiProperty({ description: 'Orders with PARTIAL status' })
  ordersPartial: number;

  @ApiProperty({ description: 'Orders with PAID status' })
  ordersPaid: number;

  @ApiProperty({ description: 'Total income in LAK (sum of total_selling_amount)' })
  totalIncomeLak: number;

  @ApiProperty({ description: 'Total income in THB (always 0 — reserved)' })
  totalIncomeThb: number;

  @ApiProperty({ description: 'Total expense in LAK (sum of total_final_cost)' })
  totalExpenseLak: number;

  @ApiProperty({ description: 'Total expense in THB (always 0 — reserved)' })
  totalExpenseThb: number;

  @ApiProperty({ description: 'Total profit in LAK' })
  totalProfitLak: number;

  @ApiProperty({ description: 'Total profit in THB (always 0 — reserved)' })
  totalProfitThb: number;

  @ApiProperty({ description: 'Total paid amount across all customer orders' })
  totalPaidAmount: number;

  @ApiProperty({ description: 'Total remaining / outstanding amount' })
  totalRemainingAmount: number;

  @ApiProperty({
    type: [MerchantFinancialByCurrencyDto],
    description: 'Financial breakdown grouped by baseCurrency of the buy exchange rate',
  })
  byCurrency: MerchantFinancialByCurrencyDto[];
}

export class MerchantDetailSummaryDto {
  @ApiProperty({ description: 'Total customers of this merchant' })
  totalCustomers: number;

  @ApiProperty({ description: 'Active customers count' })
  activeCustomers: number;

  @ApiProperty({ description: 'Inactive customers count' })
  inactiveCustomers: number;

  @ApiProperty({ description: 'Customers of type CUSTOMER' })
  customerTypeCustomer: number;

  @ApiProperty({ description: 'Customers of type AGENT' })
  customerTypeAgent: number;

  @ApiProperty({ type: MerchantDetailFinancialDto, description: 'Financial summary from orders' })
  financial: MerchantDetailFinancialDto;
}

export class MerchantDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ownerUserId: number;

  @ApiProperty()
  shopName: string;

  @ApiPropertyOptional({ nullable: true })
  shopLogoUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  shopAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactEmail: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactFacebook: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactLine: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactWhatsapp: string | null;

  @ApiProperty()
  defaultCurrency: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: MerchantDetailUserDto, nullable: true, description: 'Owner user info' })
  owner: MerchantDetailUserDto | null;

  @ApiProperty({ type: MerchantDetailSummaryDto })
  summary: MerchantDetailSummaryDto;
}



export class MerchantResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ownerUserId: number;

  @ApiProperty()
  shopName: string;

  @ApiPropertyOptional({ nullable: true })
  shopLogoUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  shopAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactEmail: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactFacebook: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactLine: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactWhatsapp: string | null;

  @ApiProperty()
  defaultCurrency: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;}