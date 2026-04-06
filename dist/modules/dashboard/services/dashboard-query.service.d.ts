import { DataSource } from 'typeorm';
import { AdminDashboardDetailsResponseDto } from '../dto/admin-dashboard-details.dto';
import { AdminDashboardSummaryResponseDto } from '../dto/admin-dashboard-summary.dto';
import { MerchantSummaryResponseDto } from '../dto/merchant-summary.dto';
import { TopCustomersResponseDto } from '../dto/top-customers.dto';
export declare class DashboardQueryService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getAdminDashboardSummary(): Promise<AdminDashboardSummaryResponseDto>;
    getAdminDashboardDetails(): Promise<AdminDashboardDetailsResponseDto>;
    getMerchantSummary(merchantId: number): Promise<MerchantSummaryResponseDto>;
    getMerchantPriceCurrencySummary(merchantId: number): Promise<any[]>;
    getMerchantPriceCurrencySummaryByDate(merchantId: number, startDate?: Date, endDate?: Date): Promise<any>;
    getTopCustomersByBuyOrder(merchantId: number): Promise<TopCustomersResponseDto>;
}
