import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CustomerOrderItemQueryService } from '../services/customer-order-item-query.service';
import { CustomerOrderItemListQueryDto } from '../dto/customer-order-item-list-query.dto';
import { CustomerOrderItemResponseDto } from '../dto/customer-order-item-response.dto';
import { ApiOkResponseBase, ApiNotFoundBase } from '../../../common/swagger/swagger.decorators';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Customer Order Items')
@Controller('customer-order-items')
export class CustomerOrderItemController {
  constructor(private readonly customerOrderItemQueryService: CustomerOrderItemQueryService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List customer order items with pagination (public)' })
  @ApiOkResponseBase()
  async getList(@Query() query: CustomerOrderItemListQueryDto) {
    return this.customerOrderItemQueryService.getList(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get customer order item by ID (public)' })
  @ApiParam({ name: 'id', description: 'Customer order item ID' })
  @ApiOkResponseBase(CustomerOrderItemResponseDto)
  @ApiNotFoundBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.customerOrderItemQueryService.getByIdOrFail(id);
  }
}
