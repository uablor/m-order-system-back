import { ApiProperty } from '@nestjs/swagger';

export class OrdersByPaymentStatusDto {
  @ApiProperty()
  UNPAID: number;

  @ApiProperty()
  PARTIAL: number;

  @ApiProperty()
  PAID: number;
}

export class OrdersByArrivalStatusDto {
  @ApiProperty()
  NOT_ARRIVED: number;

  @ApiProperty()
  ARRIVED: number;
}
