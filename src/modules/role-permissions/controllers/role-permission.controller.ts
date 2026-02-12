import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
@UseGuards(RolesGuard)
export class RolePermissionController {
  constructor(
    private readonly commandService: RolePermissionCommandService,
    private readonly queryService: RolePermissionQueryService,
  ) {}

  @Post('assign')
  @Roles(ADMIN_ROLE)
  @ApiOperation({ summary: 'Assign permission to role (ADMIN only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiNotFoundBase()
  async assign(@Body() dto: AssignPermissionDto) {
    await this.commandService.assign(dto.roleId, dto.permissionId);
    return { success: true };
  }

  @Delete(':roleId/:permissionId')
  @ApiOperation({ summary: 'Unassign permission from role' })
  @ApiParam({ name: 'roleId', format: 'uuid' })
  @ApiParam({ name: 'permissionId', format: 'uuid' })
  @ApiNotFoundBase()
  async unassign(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ) {
    await this.commandService.unassign(roleId, permissionId);
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: 'List permissions by role ID' })
  @ApiParam({ name: 'roleId', format: 'uuid' })
  @ApiOkResponseBase()
  async getByRoleId(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return this.queryService.getPermissionsByRoleId(roleId);
  }
}
