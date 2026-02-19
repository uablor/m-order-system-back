import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ExchangeRateCommandService } from '../services/exchange-rate-command.service';
import { ExchangeRateQueryService } from '../services/exchange-rate-query.service';
import { ExchangeRateCreateDto } from '../dto/exchange-rate-create.dto';
import { ExchangeRateUpdateDto } from '../dto/exchange-rate-update.dto';
import { ExchangeRateListQueryDto } from '../dto/exchange-rate-list-query.dto';
import { ExchangeRateResponseDto } from '../dto/exchange-rate-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Exchange Rates')
@Controller('exchange-rates')
export class ExchangeRateController {
  constructor(
    private readonly commandService: ExchangeRateCommandService,
    private readonly queryService: ExchangeRateQueryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create exchange rate' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiNotFoundBase()
  async create(
    @Body() dto: ExchangeRateCreateDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'List exchange rates with pagination' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: ExchangeRateListQueryDto) {
    return this.queryService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exchange rate by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Exchange rate ID' })
  @ApiOkResponseBase(ExchangeRateResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.queryService.getByIdOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exchange rate' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Exchange rate ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ExchangeRateUpdateDto,
  ) {
    return this.commandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exchange rate' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Exchange rate ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandService.delete(id);
  }
}
