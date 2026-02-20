import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrderCommandService } from '../services/order-command.service';
import { OrderQueryService } from '../services/order-query.service';
import { CreateFullOrderDto } from '../dto/create-full-order.dto';
import { OrderCreateDto } from '../dto/order-create.dto';
import { OrderUpdateDto } from '../dto/order-update.dto';
import { OrderListQueryDto } from '../dto/order-list-query.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderCommandService: OrderCommandService,
    private readonly orderQueryService: OrderQueryService,
  ) {}

  @Post('create-full')
  @ApiOperation({ summary: 'Create order with items, customer orders and customer order items in one transaction' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async merchantCreateFull(
    @Body() dto: CreateFullOrderDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  
  ) {
    return this.orderCommandService.createFull(dto, currentUser);
  }

  @Post()
  @ApiOperation({ summary: 'Create order (header only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async merchantCreate(
    @Body() dto: OrderCreateDto,
    @CurrentUser() currentUser?: CurrentUserPayload,
  ) {
    return this.orderCommandService.create(dto, currentUser?.userId ?? null);
  }

  @Get()
  @ApiOperation({ summary: 'List orders with pagination' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async adminGetList(@Query() query: OrderListQueryDto) {
    return this.orderQueryService.getList(query);
  }

  @Get('by-merchant')
  @ApiOperation({ summary: 'List orders for the authenticated merchant (auto-filter by JWT token)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async merchantGetList(
    @Query() query: OrderListQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.orderQueryService.getListByMerchant(query, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiOkResponseBase(OrderResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.orderQueryService.getByIdOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async merchantUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: OrderUpdateDto,
  ) {
    return this.orderCommandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async adminDelete(@Param('id', ParseIntPipe) id: number) {
    return this.orderCommandService.delete(id);
  }
}
