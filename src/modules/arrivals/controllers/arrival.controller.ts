import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArrivalCommandService } from '../services/arrival-command.service';
import { CreateArrivalDto } from '../dto/create-arrival.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { ApiCreatedResponseBase, ApiBadRequestBase, ApiUnauthorizedBase, ApiNotFoundBase } from '../../../common/swagger/swagger.decorators';

@ApiTags('Arrivals')
@Controller('arrivals')
export class ArrivalController {
  constructor(private readonly arrivalCommandService: ArrivalCommandService) {}

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
}
