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

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiPropertyOptional({ example: 10, default: 0, description: 'ຄ່າຂົນສົ່ງໃນສະກຸນເງິນຊື້ (shipping price in buy currency)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingPrice?: number;

  @ApiPropertyOptional({ enum: ['percent', 'cash'], description: 'percent = ສ່ວນຫຼຸດເປີເຊັນ, cash = ສ່ວນຫຼຸດເງິນສົດ (in buy currency)' })
  @IsOptional()
  @IsIn(['percent', 'cash'])
  discountType?: 'percent' | 'cash';

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
