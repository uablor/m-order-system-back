import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentCommandService } from '../services/payment-command.service';
import { PaymentQueryService } from '../services/payment-query.service';
import { PaymentCreateDto } from '../dto/payment-create.dto';
import { PaymentRejectDto, PaymentBulkRejectDto } from '../dto/payment-reject.dto';
import { PaymentBulkActionDto } from '../dto/payment-bulk-action.dto';
import { PaymentListQueryDto } from '../dto/payment-list-query.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { RequireAutoPermission } from '../../../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../../../common/policies/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/policies/roles.guard';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
  ApiForbiddenBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(PermissionsGuard)
export class PaymentController {
  constructor(
    private readonly commandService: PaymentCommandService,
    private readonly queryService: PaymentQueryService,
  ) {}

  @Post()
  @RequireAutoPermission()
  @ApiOperation({ summary: 'Create payment (customer only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async create(
    @Body() dto: PaymentCreateDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.create(dto, currentUser);
  }

  @Get('my-payments')
  @RequireAutoPermission()
  @ApiOperation({ summary: 'Get my payments (customer only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getMyPayments(
    @Query() query: PaymentListQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.queryService.getListByCustomer(query, currentUser);
  }

  @Get('merchant')
  @RequireAutoPermission()
  @ApiOperation({ summary: 'Get payments by merchant (merchant only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getMerchantPayments(
    @Query() query: PaymentListQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.queryService.getListByMerchant(query, currentUser);
  }

  @Get()
  @RequireAutoPermission()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get all payments (admin/staff only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: PaymentListQueryDto) {
    return this.queryService.getList(query);
  }

  @Get(':id')
  @RequireAutoPermission()
  @ApiOperation({ summary: 'Get payment by ID (check ownership)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiOkResponseBase(PaymentResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.queryService.getByIdWithOwnership(id, currentUser);
  }

  @Patch(':id/verify')
  @RequireAutoPermission()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Verify payment (admin/staff only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiOkResponseBase()
  @ApiNotFoundBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.verify(id, currentUser);
  }

  @Patch('bulk-verify')
  @RequireAutoPermission()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Verify multiple payments (admin/staff only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async bulkVerify(
    @Body() dto: PaymentBulkActionDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.bulkVerify(dto.paymentIds, currentUser);
  }

  @Patch(':id/reject')
  @RequireAutoPermission()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Reject payment (admin/staff only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiOkResponseBase()
  @ApiNotFoundBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PaymentRejectDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.reject(id, dto, currentUser);
  }

  @Patch('bulk-reject')
  @RequireAutoPermission()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Reject multiple payments (admin/staff only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async bulkReject(
    @Body() dto: PaymentBulkRejectDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.bulkReject(dto, currentUser);
  }

  @Delete(':id')
  @RequireAutoPermission()
  @ApiOperation({ summary: 'Delete payment (only pending payments)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiOkResponseBase()
  @ApiNotFoundBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.delete(id);
  }
}
