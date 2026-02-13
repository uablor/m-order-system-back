import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ArrivalCommandService } from '../services/arrival-command.service';
import { ArrivalQueryService } from '../services/arrival-query.service';
import { CreateArrivalDto } from '../dto/create-arrival.dto';
import { ArrivalUpdateDto } from '../dto/arrival-update.dto';
import { ArrivalListQueryDto } from '../dto/arrival-list-query.dto';
import { ArrivalResponseDto } from '../dto/arrival-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import {
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
  ApiOkResponseBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Arrivals')
@Controller('arrivals')
export class ArrivalController {
  constructor(
    private readonly arrivalCommandService: ArrivalCommandService,
    private readonly arrivalQueryService: ArrivalQueryService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Record arrival, create arrival items, update stock, and send notifications' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiNotFoundBase()
  async create(
    @Body() dto: CreateArrivalDto,
    @CurrentUser() currentUser?: CurrentUserPayload,
  ) {
    return this.arrivalCommandService.create(dto, currentUser?.userId ?? null);
  }

  @Get()
  @ApiOperation({ summary: 'List arrivals with pagination' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: ArrivalListQueryDto) {
    return this.arrivalQueryService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get arrival by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Arrival ID' })
  @ApiOkResponseBase(ArrivalResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.arrivalQueryService.getByIdOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update arrival' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Arrival ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ArrivalUpdateDto,
  ) {
    return this.arrivalCommandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete arrival' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Arrival ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.arrivalCommandService.delete(id);
  }
}
