import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardQueryService } from '../services/dashboard-query.service';
import { AnnualReportQueryDto } from '../dto/annual-report-query.dto';
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
import { MerchantPriceSummaryResponseDto } from '../dto/merchant-price-summary.dto';
import { MerchantPriceListResponseDto } from '../dto/merchant-price-list.dto';
import { AnnualReportResponseDto } from '../dto/annual-report-response.dto';

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

  @Get('merchant/price-summary')
  @ApiOperation({ summary: 'Merchant price summary - current merchant price stats' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantPriceSummaryResponseDto)
  @ApiUnauthorizedBase()
  async merchantGetPriceSummary(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.dashboardQueryService.getMerchantPriceSummary(currentUser.merchantId!);
    return createSingleResponse(data);
  }

  @Get('merchant/price-list')
  @ApiOperation({ summary: 'Merchant price list - current merchant prices in multiple currencies' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantPriceListResponseDto)
  @ApiUnauthorizedBase()
  async merchantGetPriceList(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.dashboardQueryService.getMerchantPriceList(currentUser.merchantId!);
    return createSingleResponse(data);
  }
}
