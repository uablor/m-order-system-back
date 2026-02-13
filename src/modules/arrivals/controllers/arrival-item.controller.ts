import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ArrivalItemCommandService } from '../services/arrival-item-command.service';
import { ArrivalItemQueryService } from '../services/arrival-item-query.service';
import { ArrivalItemUpdateDto } from '../dto/arrival-item-update.dto';
import { ArrivalItemListQueryDto } from '../dto/arrival-item-list-query.dto';
import { ArrivalItemResponseDto } from '../dto/arrival-item-response.dto';
import {
  ApiOkResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Arrival Items')
@Controller('arrival-items')
export class ArrivalItemController {
  constructor(
    private readonly arrivalItemCommandService: ArrivalItemCommandService,
    private readonly arrivalItemQueryService: ArrivalItemQueryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List arrival items with pagination' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: ArrivalItemListQueryDto) {
    return this.arrivalItemQueryService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get arrival item by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Arrival item ID' })
  @ApiOkResponseBase(ArrivalItemResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.arrivalItemQueryService.getByIdOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update arrival item' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Arrival item ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ArrivalItemUpdateDto,
  ) {
    return this.arrivalItemCommandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete arrival item' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Arrival item ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.arrivalItemCommandService.delete(id);
  }
}
