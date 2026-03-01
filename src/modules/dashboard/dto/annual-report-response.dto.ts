import { ApiProperty } from '@nestjs/swagger';

export class MonthlyReportDto {
  @ApiProperty()
  month: number;

  @ApiProperty()
  monthName: string;

  @ApiProperty()
  orderCount: number;

  @ApiProperty()
  finalCost: string;

  @ApiProperty()
  revenue: string;

  @ApiProperty()
  profit: string;
}

export class AnnualReportResponseDto {
  @ApiProperty()
  year: number;

  @ApiProperty({ type: () => MonthlyReportDto, isArray: true })
  months: MonthlyReportDto[];
}
