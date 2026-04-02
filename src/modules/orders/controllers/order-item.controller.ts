import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrderItemQueryService } from '../services/order-item-query.service';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import { ApiOkResponseBase, ApiNotFoundBase, ApiUnauthorizedBase } from '../../../common/swagger/swagger.decorators';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';

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

  @Get('by-merchant')
  @ApiOperation({ summary: 'List order items for the authenticated merchant (latest first)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getListByMerchant(
    @Query() query: OrderItemListQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.orderItemQueryService.getListByMerchant(query, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order item by ID or order item SKU ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Order item ID or Order item SKU ID' })
  @ApiOkResponseBase(OrderItemResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number, @Query('filter') filter?: string) {
    // If filter is set to 'sku', treat id as orderItemSkuId
    if (filter === 'sku') {
      return this.orderItemQueryService.getByOrderItemSkuIdOrFail(id);
    }
    // Default behavior: treat id as orderItemId
    return this.orderItemQueryService.getByIdOrFail(id);
  }
}
