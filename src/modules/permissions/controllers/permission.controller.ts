import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../../common/base/base.controller';
import { PermissionCommandService } from '../services/permission-command.service';
import { PermissionQueryService } from '../services/permission-query.service';
import { PermissionGeneratorService } from '../services/permission-generator.service';
import { PermissionCreateDto } from '../dto/permission-create.dto';
import { PermissionUpdateDto } from '../dto/permission-update.dto';
import { PermissionListQueryDto } from '../dto/permission-list-query.dto';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/policies/roles.guard';
import { ADMIN_ROLE } from '../../../common/policies/role.policy';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiNotFoundBase,
  ApiUnauthorizedBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController extends BaseController<
  PermissionCreateDto,
  PermissionUpdateDto,
  import('../dto/permission-response.dto').PermissionResponseDto,
  PermissionListQueryDto
> {
  constructor(
    protected readonly commandService: PermissionCommandService,
    protected readonly queryService: PermissionQueryService,
    private readonly generatorService: PermissionGeneratorService,
  ) {
    super(commandService, queryService);
  }

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  @ApiBearerAuth('BearerAuth')
  @ApiOperation({
    summary: 'Generate permissions from controller class and method names',
    description:
      'Scans all controllers and creates permission codes as {path}:{methodName} (e.g. users:create, roles:getById). Only ADMIN.',
  })
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async generateFromControllers() {
    return this.generatorService.generateFromControllers();
  }

  @Post()
  @ApiOperation({ summary: 'Create new permission' })
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  async create(@Body() dto: PermissionCreateDto) {
    return this.commandService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiOkResponseBase(PermissionResponseDto)
  @ApiNotFoundBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.queryService.getById(id);
  }

  @Get()
  @ApiOperation({ summary: 'List permissions with pagination (page, limit)' })
  @ApiOkResponseBase()
  async getList(@Query() query: PermissionListQueryDto) {
    return this.queryService.getList(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: PermissionUpdateDto) {
    return this.commandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiNotFoundBase()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandService.delete(id);
  }
}
