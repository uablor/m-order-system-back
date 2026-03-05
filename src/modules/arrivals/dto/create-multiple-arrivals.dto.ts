import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsIn,
  Min,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateNotificationDto, CreateNotificationMultipleDto } from 'src/modules/notifications/dto/create-notification.dto';

const CONDITIONS = ['OK', 'DAMAGED', 'LOST'] as const;

export class CreateArrivalItemDto {
  @ApiProperty({ description: 'Order item ID' })
  @IsNumber()
  orderItemId: number;

  @ApiProperty({ description: 'Quantity arrived', minimum: 1 })
  @IsNumber()
  @Min(1)
  arrivedQuantity: number;

  @ApiPropertyOptional({ enum: CONDITIONS })
  @IsOptional()
  @IsIn(CONDITIONS)
  condition?: 'OK' | 'DAMAGED' | 'LOST';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateArrivalDto {
  @ApiProperty({ description: 'Order ID' })
  @IsNumber()
  orderId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateArrivalItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArrivalItemDto)
  arrivalItems: CreateArrivalItemDto[];
}

export class CreateMultipleArrivalsDto {
  @ApiProperty({ description: 'Global notes for all arrivals' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Array of orders to process',
    type: [CreateArrivalDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArrivalDto)
  orders: CreateArrivalDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notification?: boolean;

  @ApiPropertyOptional({ enum: ['en', 'th', 'la'], description: 'Language for notification message template' })
  @IsOptional()
  @IsIn(['en', 'th', 'la'])
  language?: 'en' | 'th' | 'la';

  @ApiProperty({
    description: 'Array of notification data',
    example: [
      {
        customerOrderIds: [123, 124, 125],
        message: 'Your orders have arrived!',
        customerId: 1,
      },
    ],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateNotificationDto)
  notis?: CreateNotificationDto[];
}
