import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RolePermissionCommandService } from '../services/role-permission-command.service';
import { RolePermissionQueryService } from '../services/role-permission-query.service';
import { AssignPermissionDto } from '../dto/assign-permission.dto';
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

@ApiTags('Role Permissions')
@Controller('role-permissions')
export class RolePermissionController {
  constructor(
    private readonly commandService: RolePermissionCommandService,
    private readonly queryService: RolePermissionQueryService,
  ) {}

  @Post('assign')
  @ApiOperation({ summary: 'Assign permission to role (ADMIN only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiNotFoundBase()
  async adminAssign(@Body() dto: AssignPermissionDto) {
    await this.commandService.assign(dto.roleId, dto.permissionId);
    return { success: true };
  }

  @Delete(':roleId/:permissionId')
  @ApiOperation({ summary: 'Unassign permission from role' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async adminUnassign(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    await this.commandService.unassign(roleId, permissionId);
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: 'List permissions by role ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async adminGetByRoleId(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.queryService.getPermissionsByRoleId(roleId);
  }
}
