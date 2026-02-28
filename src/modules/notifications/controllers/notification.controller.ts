import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationCommandService } from '../services/notification-command.service';
import { NotificationQueryService } from '../services/notification-query.service';
import { NotificationUpdateDto } from '../dto/notification-update.dto';
import { NotificationStatusUpdateDto } from '../dto/notification-status-update.dto';
import { NotificationListQueryDto } from '../dto/notification-list-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import {
  ApiOkResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationCommandService: NotificationCommandService,
    private readonly notificationQueryService: NotificationQueryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List notifications with pagination' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async merchantGetList(@Query() query: NotificationListQueryDto, @CurrentUser() user: CurrentUserPayload) {
    return this.notificationQueryService.getList(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiOkResponseBase(NotificationResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationQueryService.getByIdOrFail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async merchantUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: NotificationUpdateDto,
  ) {
    return this.notificationCommandService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update notification send status' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async updateStatusSent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: NotificationStatusUpdateDto,
  ) {
    return this.notificationCommandService.updateStatusSent(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async adminDelete(@Param('id', ParseIntPipe) id: number) {
    return this.notificationCommandService.delete(id);
  }
}
