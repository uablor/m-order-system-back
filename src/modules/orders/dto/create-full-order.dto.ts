import {
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  ValidateNested,
  Min,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFullOrderItemSkuDto {

  @ApiProperty()
  @IsNumber()
  orderItemSkuIndex: number;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  variant: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  sellingPriceForeign: number;

  @ApiPropertyOptional({ description: 'Exchange rate ID for purchase (foreign -> LAK)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  exchangeRateBuyId?: number;

  @ApiPropertyOptional({ description: 'Exchange rate ID for selling (LAK -> foreign)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  exchangeRateSellId?: number;
}

export class CreateFullOrderItemDto {
  @ApiProperty({ description: 'Index of order item in the items array (0-based)' })
  @IsNumber()
  @Min(0)
  Index: number = 0;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  productName: string;

  @ApiProperty({ type: [CreateFullOrderItemSkuDto], description: 'SKUs for this order item' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFullOrderItemSkuDto)
  skus: CreateFullOrderItemSkuDto[];

  @ApiPropertyOptional({ enum: ['PERCENT', 'FIX'], description: 'PERCENT = ສ່ວນຫຼຸດເປີເຊັນ, FIX = ສ່ວນຫຼຸດເງິນສົດ (in buy currency)' })
  @IsOptional()
  @IsIn(['PERCENT', 'FIX'])
  discountType?: 'PERCENT' | 'FIX';

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiPropertyOptional({ description: 'Product image ID' })
  @IsOptional()
  @IsNumber()
  imageId?: number;

  @ApiPropertyOptional({ description: 'Shipping price per unit in foreign currency' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingPrice?: number;
}

export class CreateFullCustomerOrderItemDto {
  @ApiProperty({ description: 'Index of order item in the items array (0-based)' })
  @IsNumber()
  @Min(0)
  orderItemIndex: number;

  @ApiProperty({ description: 'Index of SKU within the order item (0-based)' })
  @IsNumber()
  @Min(0)
  skuIndex: number;

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

  @ApiProperty({ type: [CreateFullCustomerOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFullCustomerOrderItemDto)
  items: CreateFullCustomerOrderItemDto[];

}

export class CreateFullOrderDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  orderCode: string;

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
