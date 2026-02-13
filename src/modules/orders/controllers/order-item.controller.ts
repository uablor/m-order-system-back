import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrderItemQueryService } from '../services/order-item-query.service';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import { ApiOkResponseBase, ApiNotFoundBase, ApiUnauthorizedBase } from '../../../common/swagger/swagger.decorators';

@ApiTags('Order Items')
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemQueryService: OrderItemQueryService) {}

  @Get()
  @ApiOperation({ summary: 'List order items with pagination (optional orderId filter)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: OrderItemListQueryDto) {
    return this.orderItemQueryService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order item by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiOkResponseBase(OrderItemResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemQueryService.getByIdOrFail(id);
  }
}
