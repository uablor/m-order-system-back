import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerOrderQueryService } from '../services/customer-order-query.service';
import { CustomerOrderListQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import { ApiOkResponseBase, ApiNotFoundBase, ApiUnauthorizedBase } from '../../../common/swagger/swagger.decorators';

@ApiTags('Customer Orders')
@Controller('customer-orders')
export class CustomerOrderController {
  constructor(private readonly customerOrderQueryService: CustomerOrderQueryService) {}

  @Get()
  @ApiOperation({ summary: 'List customer orders with pagination (optional orderId, customerId filter)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: CustomerOrderListQueryDto) {
    return this.customerOrderQueryService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer order by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Customer order ID' })
  @ApiOkResponseBase(CustomerOrderResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.customerOrderQueryService.getByIdOrFail(id);
  }
}
