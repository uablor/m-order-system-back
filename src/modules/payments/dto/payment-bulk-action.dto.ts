import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentBulkActionDto {
  @ApiProperty({ description: 'Payment IDs to process', type: [Number] })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  paymentIds: number[];

  @ApiProperty({ description: 'Reason for rejection (required only for reject action)', required: false })
  @IsOptional()
  @IsString()
  rejectReason?: string;
}
