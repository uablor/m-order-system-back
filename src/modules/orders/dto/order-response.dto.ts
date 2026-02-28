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
  orderItemId: number;

  @ApiPropertyOptional({ nullable: true })
  orderItemIndex: number | null;

  @ApiPropertyOptional({ nullable: true })
  productName: string | null;

  @ApiPropertyOptional({ nullable: true })
  variant: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  sellingPriceForeign: string;

  @ApiProperty()
  sellingTotalLak: string;

  @ApiProperty()
  profitLak: string;

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
  totalSellingAmountLak: string;

  @ApiProperty()
  paidAmount: string;

  @ApiProperty()
  remainingAmount: string;

  @ApiProperty()
  paymentStatus: string;

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

  @ApiProperty()
  totalPurchaseCostLak: string;

  @ApiProperty()
  totalShippingCostLak: string;

  @ApiProperty()
  totalCostBeforeDiscountLak: string;

  @ApiProperty()
  totalDiscountLak: string;

  @ApiProperty()
  totalFinalCostLak: string;

  @ApiProperty()
  totalFinalCostThb: string;

  @ApiProperty()
  totalSellingAmountLak: string;

  @ApiProperty()
  totalSellingAmountThb: string;

  @ApiProperty()
  totalProfitLak: string;

  @ApiProperty()
  totalProfitThb: string;

  @ApiProperty()
  depositAmount: string;

  @ApiProperty()
  paidAmount: string;

  @ApiProperty()
  remainingAmount: string;

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
