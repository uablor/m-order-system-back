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
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../../common/base/controllers/base.controller';
import { UserCommandService } from '../services/user-command.service';
import { UserQueryService } from '../services/user-query.service';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserMerchantCreateDto } from '../dto/user-merchant-create.dto';
import { UserListQueryDto } from '../dto/user-list-query.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { canUpdateUser, canDeleteUser } from '../../../common/policies/role.policy';
import { ForbiddenException } from '@nestjs/common';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
  ApiForbiddenBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Users')
@Controller('users')
export class UserController extends BaseController<
  UserCreateDto,
  UserUpdateDto,
  import('../dto/user-response.dto').UserResponseDto,
  UserListQueryDto
> {
  constructor(
    protected readonly commandService: UserCommandService,
    protected readonly queryService: UserQueryService,
  ) {
    super(commandService, queryService);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiBearerAuth('BearerAuth')
  async create(@Body() dto: UserCreateDto) {
    return this.commandService.create(dto);
  }

  @Post('user-merchant')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user and merchant (registration flow)' })
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiBearerAuth('BearerAuth')
  async createUserWithMerchant(@Body() dto: UserMerchantCreateDto) {
    return this.commandService.createUserWithMerchant(dto);
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

  @Get()
  @ApiOperation({ summary: 'List users with pagination (page, limit, search)' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  @ApiNotFoundBase()
  @ApiBearerAuth('BearerAuth')
  async getList(@Query() query: UserListQueryDto) {
    return this.queryService.getList(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (self or ADMIN)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
    @CurrentUser() currentUser?: CurrentUserPayload,
  ) {
    if (currentUser && !canUpdateUser(currentUser, id)) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.commandService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (self or ADMIN)' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @ApiForbiddenBase()
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser?: CurrentUserPayload,
  ) {
    if (currentUser && !canDeleteUser(currentUser, id)) {
      throw new ForbiddenException('You can only delete your own profile or must be ADMIN');
    }
    return this.commandService.delete(id);
  }
}
