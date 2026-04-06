export declare class MonthlyReportDto {
    month: number;
    monthName: string;
    orderCount: number;
    finalCost: string;
    revenue: string;
    profit: string;
}
export declare class AnnualReportResponseDto {
    year: number;
    months: MonthlyReportDto[];
}
