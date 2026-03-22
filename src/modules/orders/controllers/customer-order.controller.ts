import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerOrderQueryService } from '../services/customer-order-query.service';
import { CustomerOrderListQueryDto, TokenQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import { ApiOkResponseBase, ApiNotFoundBase, ApiUnauthorizedBase } from '../../../common/swagger/swagger.decorators';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';

@ApiTags('Customer Orders')
@Controller('customer-orders')
export class CustomerOrderController {
  constructor(private readonly customerOrderQueryService: CustomerOrderQueryService) {}

  @Get()
  @ApiBearerAuth('BearerAuth')
  @ApiOperation({ summary: 'List customer orders for authenticated merchant (auto-filter by JWT token)' })
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: CustomerOrderListQueryDto, @CurrentUser() currentUser: CurrentUserPayload) {
    // Add merchantId from JWT token to query
    const queryWithMerchant = { ...query, merchantId: currentUser.merchantId || undefined };
    return this.customerOrderQueryService.getList(queryWithMerchant);
  }

  @Get('by-token')
  @Public()
  @ApiOperation({ summary: 'Get customer orders by customer token (public — no JWT needed)' })
  @ApiParam({ name: 'token', description: 'Customer unique token from URL' })
  @ApiOkResponseBase()
  async getByToken(
    @Query() query: CustomerOrderListQueryDto,
  ) {
    return this.customerOrderQueryService.getList(query);
  }

  @Get('summary-by-token')
  @Public()
  @ApiOperation({ summary: 'Get customer orders by customer token (public — no JWT needed)' })
  @ApiParam({ name: 'token', description: 'Customer unique token from URL' })
  @ApiOkResponseBase()
  async getSummaryByToken(
    @Query() query: TokenQueryDto,
  ) {
    return this.customerOrderQueryService.getSummary(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get customer order by ID (public)' })
  @ApiParam({ name: 'id', description: 'Customer order ID' })
  @ApiOkResponseBase(CustomerOrderResponseDto)
  @ApiNotFoundBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.customerOrderQueryService.getByIdOrFail(id);
  }


  

}
