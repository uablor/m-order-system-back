import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../../common/base/controllers/base.controller';
import { RoleCommandService } from '../services/role-command.service';
import { RoleQueryService } from '../services/role-query.service';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';
import { RoleListQueryDto } from '../dto/role-list-query.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/policies/roles.guard';
import { ADMIN_ROLE } from '../../../common/policies/role.policy';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(RolesGuard)
export class RoleController extends BaseController<
  RoleCreateDto,
  RoleUpdateDto,
  import('../dto/role-response.dto').RoleResponseDto,
  RoleListQueryDto
> {
  constructor(
    protected readonly commandService: RoleCommandService,
    protected readonly queryService: RoleQueryService,
  ) {
    super(commandService, queryService);
  }

  @Post()
  @Roles(ADMIN_ROLE)
  @ApiOperation({ summary: 'Create new role (ADMIN only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async create(@Body() dto: RoleCreateDto) {
    return this.commandService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiOkResponseBase(RoleResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return super.getById(id);
  }

  @Get()
  @ApiOperation({ summary: 'List roles with pagination (page, limit)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: RoleListQueryDto) {
    return this.queryService.getList(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: RoleUpdateDto) {
    return this.commandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandService.delete(id);
  }
}
