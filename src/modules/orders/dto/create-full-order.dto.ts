import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsDateString,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFullOrderItemDto {
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
}

export class CreateFullCustomerOrderDto {
  @ApiProperty()
  @IsNumber()
  customerId: number;

  @ApiPropertyOptional({ description: 'Amount already paid', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPaid?: number;

  @ApiProperty({ type: [CreateFullCustomerOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFullCustomerOrderItemDto)
  items: CreateFullCustomerOrderItemDto[];
}

export class CreateFullOrderDto {
  @ApiProperty()
  @IsNumber()
  merchantId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  orderCode: string;

  @ApiProperty({ example: '2025-02-11' })
  @IsDateString()
  orderDate: string;

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
}
