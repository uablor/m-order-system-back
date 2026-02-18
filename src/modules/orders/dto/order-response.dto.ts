import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { OrderItemResponseDto } from './order-item-response.dto';

// 👇 DTO สำหรับ CustomerOrderItem
export class CustomerOrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderItemId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  sellingTotalLak: string;

  @ApiProperty()
  profitLak: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// 👇 DTO สำหรับ CustomerOrder
export class CustomerOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  totalSellingAmountLak: string;

  @ApiProperty()
  totalPaid: string;

  @ApiProperty()
  remainingAmount: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty({ type: [CustomerOrderItemResponseDto] })
  items: CustomerOrderItemResponseDto[];

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
