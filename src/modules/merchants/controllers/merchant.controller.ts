import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantCommandService } from '../services/merchant-command.service';
import { MerchantQueryService } from '../services/merchant-query.service';
import { MerchantCreateDto } from '../dto/merchant-create.dto';
import { MerchantUpdateDto } from '../dto/merchant-update.dto';
import { MerchantListQueryDto } from '../dto/merchant-list-query.dto';
import { MerchantResponseDto } from '../dto/merchant-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { NoCache } from '../../../common/decorators/no-cache.decorator';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantController {
  constructor(
    protected readonly commandService: MerchantCommandService,
    protected readonly queryService: MerchantQueryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create merchant for current user' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async create(
    @Body() dto: MerchantCreateDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.create(currentUser.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiOkResponseBase(MerchantResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @NoCache()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.queryService.getByIdOrFail(id);
  }

  @Get()
  @ApiOperation({ summary: 'List merchants with pagination (filtered by current user)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  @NoCache()
  async getList(
    @Query() query: MerchantListQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.queryService.getList(query, currentUser.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update merchant' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: MerchantUpdateDto) {
    return this.commandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete merchant' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Merchant ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandService.delete(id);
  }
}
