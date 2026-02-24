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
import {
  SUPERADMIN_ROLE_NAME,
  ADMIN_ROLE_NAME,
  ADMIN_MERCHANT_ROLE_NAME,
  EMPLOYEE_MERCHANT_ROLE_NAME,
} from '../../../database/seeds/role.seeder';
import { Public } from '../../../common/decorators/public.decorator';

/** Roles allowed to manage merchant payments (verify / reject) */
const MERCHANT_ROLES = [
  SUPERADMIN_ROLE_NAME,
  ADMIN_ROLE_NAME,
  ADMIN_MERCHANT_ROLE_NAME,
  EMPLOYEE_MERCHANT_ROLE_NAME,
] as const;

/** Roles allowed to view the full payment list (admin only) */
const ADMIN_ROLES = [SUPERADMIN_ROLE_NAME, ADMIN_ROLE_NAME] as const;

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly commandService: PaymentCommandService,
    private readonly queryService: PaymentQueryService,
  ) {}

  // ─── Create (public — customer uses URL token, no JWT needed) ────────────

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create payment (public — customer submits via token page)' })
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  async create(
    @Body() dto: PaymentCreateDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.create(dto, currentUser);
  }

  // ─── Customer: own payments ─────────────────────────────────────────────

  @Get('my-payments')
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

  // ─── Merchant: payments for their orders ───────────────────────────────

  @Get('merchant')
  @UseGuards(RolesGuard)
  @Roles(...MERCHANT_ROLES)
  @ApiOperation({ summary: 'Get payments by merchant' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getMerchantPayments(
    @Query() query: PaymentListQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.queryService.getListByMerchant(query, currentUser);
  }

  // ─── Admin: full payment list ───────────────────────────────────────────

  @Get()
  @UseGuards(RolesGuard)
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Get all payments (admin only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  async getList(@Query() query: PaymentListQueryDto) {
    return this.queryService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
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

  // ─── Verify / Reject (merchant & admin) ────────────────────────────────

  @Patch(':id/verify')
  @UseGuards(RolesGuard)
  @Roles(...MERCHANT_ROLES)
  @ApiOperation({ summary: 'Verify payment (admin / merchant)' })
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
  @UseGuards(RolesGuard)
  @Roles(...MERCHANT_ROLES)
  @ApiOperation({ summary: 'Verify multiple payments (admin / merchant)' })
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
  @UseGuards(RolesGuard)
  @Roles(...MERCHANT_ROLES)
  @ApiOperation({ summary: 'Reject payment (admin / merchant)' })
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
  @UseGuards(RolesGuard)
  @Roles(...MERCHANT_ROLES)
  @ApiOperation({ summary: 'Reject multiple payments (admin / merchant)' })
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

  // ─── Delete ─────────────────────────────────────────────────────────────

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(...MERCHANT_ROLES)
  @ApiOperation({ summary: 'Delete payment (pending only)' })
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
