import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationStatus } from '../enum/notification.enum';

export class NotificationStatusUpdateDto {
  @ApiPropertyOptional({ 
    enum: NotificationStatus,
    description: 'Update the send status of the notification'
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;
}
