import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerOrderQueryService } from '../services/customer-order-query.service';
import { CustomerOrderListQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import { ApiOkResponseBase, ApiNotFoundBase, ApiUnauthorizedBase } from '../../../common/swagger/swagger.decorators';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Customer Orders')
@Controller('customer-orders')
export class CustomerOrderController {
  constructor(private readonly customerOrderQueryService: CustomerOrderQueryService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List customer orders with pagination and optional token filter' })
  @ApiOkResponseBase()
  async getList(@Query() query: CustomerOrderListQueryDto) {
    return this.customerOrderQueryService.getList(query);
  }

  @Get('by-token/:token')
  @Public()
  @ApiOperation({ summary: 'Get customer orders by customer token (public — no JWT needed)' })
  @ApiParam({ name: 'token', description: 'Customer unique token from URL' })
  @ApiOkResponseBase()
  async getByToken(
    @Param('token') token: string,
    @Query() query: CustomerOrderListQueryDto,
  ) {
    const queryWithToken = { ...query, customerToken: token };
    return this.customerOrderQueryService.getList(queryWithToken);
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
