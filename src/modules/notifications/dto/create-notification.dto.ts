import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Array of customer order IDs to create notifications for',
    example: [123, 124, 125],
  })
  @IsArray()
  customerOrderIds: number[];

  @ApiProperty({
    description: 'Custom message for the notification',
    example: 'Your orders have arrived!',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;


  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  @IsNumber()
  customerId: number;

  @ApiPropertyOptional({ enum: ['en', 'th', 'la'] })
  @IsOptional()
  @IsIn(['en', 'th', 'la'])
  language?: 'en' | 'th' | 'la';
}

export class CreateNotificationMultipleDto {
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
  @IsArray()
  @IsOptional()
  notifications: CreateNotificationDto[];

  @ApiPropertyOptional({ enum: ['en', 'th', 'la'], description: 'Language for notification message template' })
  @IsOptional()
  @IsIn(['en', 'th', 'la'])
  language?: 'en' | 'th' | 'la';
}
