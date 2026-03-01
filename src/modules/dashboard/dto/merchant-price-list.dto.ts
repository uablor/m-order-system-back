import { ApiProperty } from '@nestjs/swagger';

export class MerchantPriceListResponseDto {
  @ApiProperty({ description: 'Price summaries in USDT currency' })
  usdt: {
    totalPrice: number;      // Total price in USDT
    totalPriceUnpaid: number; // Total price for UNPAID orders in USDT
    totalPricePaid: number;    // Total price for PAID orders in USDT
  };

  @ApiProperty({ description: 'Price summaries in THB currency' })
  thb: {
    totalPrice: number;      // Total price in THB
    totalPriceUnpaid: number; // Total price for UNPAID orders in THB
    totalPricePaid: number;    // Total price for PAID orders in THB
  };

  @ApiProperty({ description: 'Price summaries in LAK currency (calculated)' })
  lak: {
    totalPrice: number;      // Total price in LAK (calculator)
    totalPriceUnpaid: number; // Total price for UNPAID orders in LAK
    totalPricePaid: number;    // Total price for PAID orders in LAK
  };
}
