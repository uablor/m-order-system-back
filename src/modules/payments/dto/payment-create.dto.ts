import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class PaymentCreateDto {
  @ApiProperty({ description: 'Customer Order ID' })
  @IsNotEmpty()
  @IsNumber()
  customerOrderId: number;

  @ApiProperty({ description: 'Payment amount' })
  @IsNotEmpty()
  @IsNumber()
  paymentAmount: number;

  @ApiProperty({ description: 'Payment proof image ID', required: false })
  @IsNumber()
  paymentProofImageId: number;

  @ApiProperty({ description: 'Message from customer', required: false })
  @IsOptional()
  @IsString()
  customerMessage?: string;
}
