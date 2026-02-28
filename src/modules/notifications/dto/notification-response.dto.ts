import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerResponseDto } from 'src/modules/customers/dto/customer-response.dto';
import { MerchantResponseDto } from 'src/modules/merchants/dto/merchant-response.dto';
  
export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  merchant: MerchantResponseDto;

  @ApiProperty()
  customer: CustomerResponseDto;

  @ApiProperty({ enum: ['ARRIVAL', 'PAYMENT', 'REMINDER'] })
  notificationType: string;

  @ApiProperty({ enum: ['FB', 'LINE', 'WHATSAPP'] })
  channel: string;

  @ApiProperty()
  recipientContact: string;

  @ApiProperty()
  messageContent: string;

  @ApiPropertyOptional({ nullable: true })
  notificationLink: string | null;

  @ApiProperty()
  retryCount: number;

  @ApiPropertyOptional({ nullable: true })
  lastRetryAt: Date | null;

  @ApiProperty({ enum: ['SENT', 'FAILED'] })
  status: string;

  // Add missing statusSent field
  @ApiProperty({ enum: ['PENDING', 'SENT', 'CANCELLED'] })
  statusSent?: string;

  @ApiPropertyOptional({ nullable: true })
  sentAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  errorMessage: string | null;

  @ApiPropertyOptional({ nullable: true })
  relatedOrders: number[] | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
