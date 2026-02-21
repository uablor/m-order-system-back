import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
// import { BaseController } from '../../../common/base/controllers/base.controller';
import { UserCommandService } from '../services/user-command.service';
import { UserQueryService } from '../services/user-query.service';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { ProfileUpdateDto } from '../dto/profile-update.dto';
import { UserMerchantCreateDto } from '../dto/user-merchant-create.dto';
import { UserListQueryDto } from '../dto/user-list-query.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';

import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
  ApiForbiddenBase,
} from '../../../common/swagger/swagger.decorators';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AcitveDto } from 'src/common/base/dtos/active.dto';

@ApiTags('Users')
@Controller('users')
// export class UserController extends BaseController<
//   UserCreateDto,
//   UserUpdateDto,
//   import('../dto/user-response.dto').UserResponseDto,
//   UserListQueryDto
// > {
//   constructor(
//     protected readonly commandService: UserCommandService,
//     protected readonly queryService: UserQueryService,
//   ) {
//     super(commandService, queryService);
//   }
export class UserController {
  constructor(
    protected readonly commandService: UserCommandService,
    protected readonly queryService: UserQueryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiBearerAuth('BearerAuth')
  async adminCreate(@Body() dto: UserCreateDto) {
    return this.commandService.create(dto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiBearerAuth('BearerAuth')
  async  merchantCreate(@Body() dto: UserCreateDto, @CurrentUser auth : CurrentUserPayload) {
    return this.commandService.create(dto, auth);
  }

  @Post('user-merchant')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user and merchant (registration flow)' })
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiBearerAuth('BearerAuth')
  async adminCreateWithMerchant(@Body() dto: UserMerchantCreateDto) {
    return this.commandService.createUserWithMerchant(dto);
  }

  @Patch('change-password-user')
  @ApiOperation({ summary: 'Update user (self or ADMIN)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.changePassword(currentUser.userId!, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List users with pagination (page, limit, search) for admin',
  })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiNotFoundBase()
  @ApiBearerAuth('BearerAuth')
  async adminGetList(@Query() query: UserListQueryDto) {
    return this.queryService.getList(query);
  }

  @Get('by-merchant')
  @ApiOperation({
    summary: 'List users by merchant with pagination (page, limit, search)',
  })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiNotFoundBase()
  @ApiBearerAuth('BearerAuth')
  async merchantGetList(
    @Query() query: UserListQueryDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.queryService.getList(query, currentUser.merchantId!);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update own profile (email, fullName only)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async updateProfile(
    @Body() dto: ProfileUpdateDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.commandService.update(currentUser.userId!, dto as any);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by admin' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
  ) {
    return this.commandService.update(id, dto);
  }

  @Patch(':id/change-password-by-id')
  @ApiOperation({ summary: 'Update user (self or ADMIN)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async adminChangePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.commandService.changePassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (self or ADMIN)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async adminDelete(@Param('id', ParseIntPipe) id: number) {
    return this.commandService.delete(id);
  }

  @Patch(':id/active')
  @ApiOperation({ summary: 'Update user active status' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async adminUpdateActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AcitveDto,
  ) {
    return this.commandService.setActive(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponseBase(UserResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiBadRequestBase()
  @ApiBearerAuth('BearerAuth')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.queryService.getById(id);
  }
}
