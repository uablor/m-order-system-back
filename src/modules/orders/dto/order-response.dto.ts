import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { OrderItemResponseDto } from './order-item-response.dto';

// 👇 DTO สำหรับ CustomerOrderItem
export class CustomerOrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  customerOrderId: number;

  @ApiProperty()
  orderItemSkuId: number;

  @ApiPropertyOptional({ nullable: true })
  variant: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  sellingPriceForeign: string;

  @ApiProperty()
  purchasePrice: string;

  @ApiProperty()
  purchaseTotal: string;

  @ApiProperty()
  sellingTotal: string;

  @ApiProperty()
  profit: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CustomerSnapshotDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerType: string;
}

// 👇 DTO สำหรับ CustomerOrder
export class CustomerOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  customerId: number;

  @ApiPropertyOptional({ nullable: true, type: () => CustomerSnapshotDto })
  customer: CustomerSnapshotDto | null;

  @ApiProperty()
  totalSellingAmount: string;

  @ApiProperty()
  paidAmount: string;

  @ApiProperty()
  remainingAmount: string;
  
  @ApiProperty()
  targetCurrencyTotalSellingAmount: string;
  
  @ApiProperty()
  targetCurrencyPaidAmount: string;
  
  @ApiProperty()
  targetCurrencyRemainingAmount: string;

  @ApiProperty()
  paymentStatus: string;
  
  @ApiPropertyOptional({ nullable: true })
  discountType: string | null;
  
  @ApiPropertyOptional({ nullable: true })
  discountValue: number | null;
  
  @ApiPropertyOptional({ nullable: true })
  discountAmount: string | null;

  // @ApiProperty({ description: 'Whether this order has a pending payment waiting for approval' })
  // hasPendingPayment: boolean;

  @ApiProperty({ type: [CustomerOrderItemResponseDto] })
  customerOrderItems: CustomerOrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// 👇 DTO สำหรับ Order หลัก
export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  merchantId: number;

  @ApiPropertyOptional({ nullable: true })
  createdByUser: UserResponseDto | null;

  @ApiProperty()
  orderCode: string;

  @ApiProperty()
  orderDate: string;

  @ApiProperty()
  arrivalStatus: string;

  @ApiPropertyOptional({ nullable: true })
  arrivedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  notifiedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  exchangeRateBuy: {
    id: number;
    baseCurrency: string;
    targetCurrency: string;
    rate: string | null;
    rateType: string;
    rateDate: Date;
    isActive: boolean;
  } | null;

  @ApiPropertyOptional({ nullable: true })
  exchangeRateSell: {
    id: number;
    baseCurrency: string;
    targetCurrency: string;
    rate: string | null;
    rateType: string;
    rateDate: Date;
    isActive: boolean;
  } | null;

  @ApiPropertyOptional({ nullable: true })
  shippingExchangeRate: {
    id: number;
    baseCurrency: string;
    targetCurrency: string;
    rate: string | null;
    rateType: string;
    rateDate: Date;
    isActive: boolean;
  } | null;

  @ApiProperty()
  exchangeRateBuyValue: string | null;

  @ApiPropertyOptional({ nullable: true })
  exchangeRateSellValue: string | null;

  @ApiProperty()
  totalPurchaseCost: string;

  @ApiProperty()
  totalShippingCost: string;

  @ApiProperty()
  totalCostBeforeDiscount: string;

  @ApiProperty()
  totalDiscount: string;

  @ApiProperty()
  totalFinalCost: string;

  @ApiProperty()
  totalSellingAmount: string;

  @ApiProperty()
  totalProfit: string;

  
  @ApiProperty()
  targetCurrencyTotalPurchaseCost: string;

  @ApiProperty()
  targetCurrencyTotalShippingCost: string;

  @ApiProperty()
  targetCurrencyTotalCostBeforeDiscount: string;

  @ApiProperty()
  targetCurrencyTotalDiscount: string;

  @ApiProperty()
  targetCurrencyTotalFinalCost: string;

  @ApiProperty()
  targetCurrencyTotalSellingAmount: string;

  @ApiProperty()
  targetCurrencyTotalProfit: string;

  @ApiProperty()
  targetCurrencyTotalShippingCostByShippingExchangeRate: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiPropertyOptional({ type: [OrderItemResponseDto] })
  orderItems: OrderItemResponseDto[];

  @ApiPropertyOptional({ type: [CustomerOrderResponseDto] })
  customerOrders: CustomerOrderResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
