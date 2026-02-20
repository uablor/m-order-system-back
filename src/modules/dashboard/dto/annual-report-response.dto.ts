import { ApiProperty } from '@nestjs/swagger';

export class MonthlyReportDto {
  @ApiProperty()
  month: number;

  @ApiProperty()
  monthName: string;

  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  finalCostLak: string;

  @ApiProperty()
  revenueLak: string;

  @ApiProperty()
  revenueThb: string;

  @ApiProperty()
  profitLak: string;

  @ApiProperty()
  profitThb: string;
}

export class AnnualReportResponseDto {
  @ApiProperty()
  year: number;

  @ApiProperty({ type: () => MonthlyReportDto, isArray: true })
  months: MonthlyReportDto[];
}
