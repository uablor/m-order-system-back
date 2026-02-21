import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class PaymentRejectDto {
  @ApiProperty({ description: 'Reason for rejection' })
  @IsNotEmpty()
  @IsString()
  rejectReason: string;
}

export class PaymentBulkRejectDto {
  @ApiProperty({ description: 'Payment IDs to reject', type: [Number] })
  @IsNotEmpty()
  @IsArray()
  paymentIds: number[];

  @ApiProperty({ description: 'Reason for rejection' })
  @IsNotEmpty()
  @IsString()
  rejectReason: string;
}
