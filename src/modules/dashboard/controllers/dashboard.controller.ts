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
import { MerchantDashboardResponseDto } from '../dto/merchant-dashboard-response.dto';
import { AnnualReportResponseDto } from '../dto/annual-report-response.dto';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';

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

  @Get('merchant')
  @ApiOperation({ summary: 'Merchant dashboard (กรองด้วย merchantId จาก JWT อัตโนมัติ)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantDashboardResponseDto)
  @ApiUnauthorizedBase()
  async merchantGetDashboard(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.dashboardQueryService.getMerchantDashboard(currentUser.merchantId!);
    return createSingleResponse(data);
  }

  @Get('merchant/annual-report')
  @ApiOperation({ summary: 'Merchant annual report by year (กรองด้วย merchantId จาก JWT อัตโนมัติ)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(AnnualReportResponseDto)
  @ApiUnauthorizedBase()
  async merchantGetAnnualReport(
    @Query() query: AnnualReportQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    const year = query.year ?? new Date().getFullYear();
    const data = await this.dashboardQueryService.getMerchantAnnualReport(year, currentUser.merchantId!);
    return createSingleResponse(data);
  }
}
