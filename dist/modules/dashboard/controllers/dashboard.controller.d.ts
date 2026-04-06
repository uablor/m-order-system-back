import { DashboardQueryService } from '../services/dashboard-query.service';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { AdminDashboardDetailsResponseDto } from '../dto/admin-dashboard-details.dto';
import { AdminDashboardSummaryResponseDto } from '../dto/admin-dashboard-summary.dto';
import { MerchantSummaryResponseDto } from '../dto/merchant-summary.dto';
import { MerchantGetPriceCurrencySummaryDto } from '../dto/merchant-price-currency-summary.dto';
import { TopCustomersResponseDto } from '../dto/top-customers.dto';
export declare class DashboardController {
    private readonly dashboardQueryService;
    constructor(dashboardQueryService: DashboardQueryService);
    adminGetDashboardSummary(): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<AdminDashboardSummaryResponseDto>>;
    adminGetDashboardDetails(): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<AdminDashboardDetailsResponseDto>>;
    merchantGetSummary(currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<MerchantSummaryResponseDto>>;
    merchantGetPriceCurrencySummary(currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<any[]>>;
    adminGetMerchantPriceCurrencySummary(currentUser: CurrentUserPayload, body: {
        merchantId: number;
    }): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<any[]>>;
    getMerchantPriceCurrencySummaryByDate(currentUser: CurrentUserPayload, body: MerchantGetPriceCurrencySummaryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<any>>;
    getTopCustomersByBuyOrder(currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<TopCustomersResponseDto>>;
}
