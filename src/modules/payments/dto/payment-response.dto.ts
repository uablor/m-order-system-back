import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  customerOrderId: number;

  @ApiProperty()
  paymentAmount: number;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  paymentProofUrl: string;

  @ApiProperty()
  customerMessage: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  verifiedById: number;

  @ApiProperty()
  verifiedAt: Date;

  @ApiProperty()
  rejectedById: number;

  @ApiProperty()
  rejectedAt: Date;

  @ApiProperty()
  rejectReason: string;

  @ApiProperty()
  notes: string;

  @ApiProperty({ nullable: true })
  readAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
