import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  merchantId: number;

  @ApiProperty()
  customerId: number;

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
