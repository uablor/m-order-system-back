import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationCommandService } from '../services/notification-command.service';
import { NotificationQueryService } from '../services/notification-query.service';
import { NotificationUpdateDto } from '../dto/notification-update.dto';
import { NotificationListQueryDto } from '../dto/notification-list-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';
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
  async merchantGetList(@Query() query: NotificationListQueryDto) {
    return this.notificationQueryService.getList(query);
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
