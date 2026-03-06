import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MerchantCommandService } from '../services/merchant-command.service';
import { MerchantQueryService } from '../services/merchant-query.service';
import { MerchantCreateDto } from '../dto/merchant-create.dto';
import { MerchantUpdateDto } from '../dto/merchant-update.dto';
import { MerchantListQueryDto } from '../dto/merchant-list-query.dto';
import { MerchantResponseDto } from '../dto/merchant-response.dto';
import { MerchantDetailResponseDto } from '../dto/merchant-detail-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { NoCache } from '../../../common/decorators/no-cache.decorator';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';
import { createSingleResponse } from 'src/common/base/helpers/response.helper';
import { MerchantGetPriceCurrencySummaryDto, MerchantPriceCurrencySummaryDto } from 'src/modules/dashboard/dto/merchant-price-currency-summary.dto';
import { DashboardQueryService } from 'src/modules/dashboard/services/dashboard-query.service';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantController {
  constructor(
    protected readonly commandService: MerchantCommandService,
    protected readonly queryService: MerchantQueryService,
    protected readonly dashboardQueryService: DashboardQueryService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create merchant for current user' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async adminCreate(
    @Body() dto: MerchantCreateDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.create(currentUser.userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List merchants with pagination (filtered by current user)',
  })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async adminGetList(@Query() query: MerchantListQueryDto) {
    return this.queryService.getList(query);
  }

  @Get('merchant-detail')
  @ApiOperation({
    summary: 'Get merchant detail for current user',
  })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async merchantGetDetail(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.queryService.findMerchantDetail(currentUser.userId);
  }

  @Get(':id/detail')
  @ApiOperation({
    summary: 'Get merchant detail by ID with owner and summary',
    description:
      'Returns full merchant info joined with owner user, ' +
      'and a summary (customer counts, financial summary from orders).',
  })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiOkResponseBase(MerchantDetailResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @NoCache()
  async getDetailById(@Param('id', ParseIntPipe) id: number) {
    return this.queryService.getDetailById(id);
  }
  @Post('price-currency-summary')
  @ApiOperation({ summary: 'Merchant price currency summary - grouped by target currency' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantPriceCurrencySummaryDto)
  @ApiUnauthorizedBase()
  async adminGetMerchantPriceCurrencySummary(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.dashboardQueryService.getMerchantPriceCurrencySummary(currentUser.merchantId!);
    return createSingleResponse(data);
  }

  @Post('price-currency-summary-by-date')
  @ApiOperation({ summary: 'Merchant price currency summary - grouped by target currency' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase(MerchantPriceCurrencySummaryDto)
  @ApiUnauthorizedBase()
  async adminGetMerchantPriceCurrencySummaryByDate(
    @Body() body: MerchantGetPriceCurrencySummaryDto) {
    const data = await this.dashboardQueryService.getMerchantPriceCurrencySummaryByDate(body.merchantId!, body.startDate, body.endDate);
    return createSingleResponse(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiOkResponseBase(MerchantResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @NoCache()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.queryService.getByIdOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update merchant' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MerchantUpdateDto,
  ) {
    return this.commandService.update(id, dto);
  }

  @Patch('my-merchant')
  @ApiOperation({ summary: 'Update merchant' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async merchantUpdate(
    @Body() dto: MerchantUpdateDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.update(currentUser.merchantId!, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete merchant' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async adminDelete(@Param('id', ParseIntPipe) id: number) {
    return this.commandService.delete(id);
  }
}
