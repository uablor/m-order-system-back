import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardQueryService } from '../services/dashboard-query.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import {
  ApiOkResponseBase,
  ApiUnauthorizedBase,
} from '../../../common/swagger/swagger.decorators';
import { AdminDashboardDetailsResponseDto } from '../dto/admin-dashboard-details.dto';
import { AdminDashboardSummaryResponseDto } from '../dto/admin-dashboard-summary.dto';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';
import { MerchantSummaryResponseDto } from '../dto/merchant-summary.dto';
import { MerchantGetPriceCurrencySummaryDto, MerchantPriceCurrencySummaryDto } from '../dto/merchant-price-currency-summary.dto';
import { TopCustomersResponseDto } from '../dto/top-customers.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardQueryService: DashboardQueryService) {}

  @Get('admin/summary')
  @ApiOperation({ summary: 'Admin dashboard summary - total counts' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(AdminDashboardSummaryResponseDto)
  @ApiUnauthorizedBase()
  async adminGetDashboardSummary() {
    const data = await this.dashboardQueryService.getAdminDashboardSummary();
    return createSingleResponse(data);
  }

  @Get('admin/details')
  @ApiOperation({ summary: 'Admin dashboard details - top merchants and recent user logins' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(AdminDashboardDetailsResponseDto)
  @ApiUnauthorizedBase()
  async adminGetDashboardDetails() {
    const data = await this.dashboardQueryService.getAdminDashboardDetails();
    return createSingleResponse(data);
  }

  @Get('merchant/summary')
  @ApiOperation({ summary: 'Merchant summary - current merchant stats' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantSummaryResponseDto)
  @ApiUnauthorizedBase()
  async merchantGetSummary(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.dashboardQueryService.getMerchantSummary(currentUser.merchantId!);
    return createSingleResponse(data);
  }

  @Post('merchant/price-currency-summary')
  @ApiOperation({ summary: 'Merchant price currency summary - grouped by target currency' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantPriceCurrencySummaryDto)
  @ApiUnauthorizedBase()
  async merchantGetPriceCurrencySummary(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.dashboardQueryService.getMerchantPriceCurrencySummary(currentUser.merchantId!);
    return createSingleResponse(data);
  }
  @Post('merchant/price-currency-summary-by-date')
  @ApiOperation({ summary: 'Merchant price currency summary - grouped by target currency' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantPriceCurrencySummaryDto)
  @ApiUnauthorizedBase()
  async getMerchantPriceCurrencySummaryByDate(@CurrentUser() currentUser: CurrentUserPayload
, @Body() body: MerchantGetPriceCurrencySummaryDto) {
    const data = await this.dashboardQueryService.getMerchantPriceCurrencySummaryByDate(currentUser.merchantId!, body.startDate, body.endDate);
    return createSingleResponse(data);
  }

  @Get('merchant/top-customers')
  @ApiOperation({ summary: 'Top 5 customers by buy order amount' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(TopCustomersResponseDto)
  @ApiUnauthorizedBase()
  async getTopCustomersByBuyOrder(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.dashboardQueryService.getTopCustomersByBuyOrder(currentUser.merchantId!);
    return createSingleResponse(data);
  }


  


}
