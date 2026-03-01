import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusSend } from '../enum/status-send.enum';

export class NotificationStatusUpdateDto {
  @ApiPropertyOptional({ 
    enum: StatusSend,
    description: 'Update the send status of the notification'
  })
  @IsOptional()
  @IsEnum(StatusSend)
  statusSent?: StatusSend;
}
