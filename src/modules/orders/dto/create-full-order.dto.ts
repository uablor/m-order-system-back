import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFullOrderItemDto {
  @ApiProperty({ description: 'Index of order item in the items array (0-based)' })
  @IsNumber()
  @Min(0)
  Index: number = 0;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  productName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  variant?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'THB' })
  @IsString()
  @MaxLength(10)
  purchaseCurrency: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiPropertyOptional({ enum: ['PERCENT', 'FIX'] })
  @IsOptional()
  @IsIn(['PERCENT', 'FIX'])
  discountType?: 'PERCENT' | 'FIX';

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  sellingPriceForeign: number;


  constructor(partial: Partial<CreateFullOrderItemDto>) {
    this.productName = partial.productName ?? '';
    this.variant = partial.variant ?? '';
    this.quantity = partial.quantity ?? 1;
    this.purchaseCurrency = partial.purchaseCurrency ?? '';
    this.purchasePrice = partial.purchasePrice ?? 0;
    this.discountType = partial.discountType ?? 'FIX';
    this.discountValue = partial.discountValue ?? 0;
    this.sellingPriceForeign = partial.sellingPriceForeign ?? 0;
  }
}

export class CreateFullCustomerOrderItemDto {
  @ApiProperty({ description: 'Index of order item in the items array (0-based)' })
  @IsNumber()
  @Min(0)
  orderItemIndex: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Override selling price in foreign currency' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPriceForeign?: number;

  constructor(partial: Partial<CreateFullCustomerOrderItemDto>) {
    this.orderItemIndex = partial.orderItemIndex ?? 0;
    this.quantity = partial.quantity ?? 1;
    this.sellingPriceForeign = partial.sellingPriceForeign ?? 0;
  }
}

export class CreateFullCustomerOrderDto {
  @ApiProperty()
  @IsNumber()
  customerId: number;

  @ApiProperty({ type: [CreateFullCustomerOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFullCustomerOrderItemDto)
  items: CreateFullCustomerOrderItemDto[];
  constructor(partial: Partial<CreateFullCustomerOrderDto>) {
    this.customerId = partial.customerId ?? 0;
    this.items = partial.items?.map(item => new CreateFullCustomerOrderItemDto(item)) ?? [];
  }
}

export class CreateFullOrderDto {

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  orderCode: string;

  @ApiPropertyOptional({ description: 'Total shipping cost in LAK', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalShippingCostLak?: number;

  @ApiProperty({ type: [CreateFullOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFullOrderItemDto)
  items: CreateFullOrderItemDto[];

  @ApiProperty({ type: [CreateFullCustomerOrderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFullCustomerOrderDto)
  customerOrders: CreateFullCustomerOrderDto[];

  constructor(partial: Partial<CreateFullOrderDto>) {
    this.orderCode = partial.orderCode ?? '';
    this.totalShippingCostLak = partial.totalShippingCostLak ?? 0;
    this.items = partial.items?.map(item => new CreateFullOrderItemDto(item)) ?? [];
    this.customerOrders = partial.customerOrders?.map(item => new CreateFullCustomerOrderDto(item)) ?? [];
  }
}