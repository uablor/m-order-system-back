import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerOrderItemQueryService } from '../services/customer-order-item-query.service';
import { CustomerOrderItemListQueryDto } from '../dto/customer-order-item-list-query.dto';
import { CustomerOrderItemResponseDto } from '../dto/customer-order-item-response.dto';
import { ApiOkResponseBase, ApiNotFoundBase, ApiUnauthorizedBase } from '../../../common/swagger/swagger.decorators';

@ApiTags('Customer Order Items')
@Controller('customer-order-items')
export class CustomerOrderItemController {
  constructor(private readonly customerOrderItemQueryService: CustomerOrderItemQueryService) {}

  @Get()
  @ApiOperation({ summary: 'List customer order items with pagination (optional customerOrderId, orderItemId filter)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: CustomerOrderItemListQueryDto) {
    return this.customerOrderItemQueryService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer order item by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Customer order item ID' })
  @ApiOkResponseBase(CustomerOrderItemResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.customerOrderItemQueryService.getByIdOrFail(id);
  }
}
