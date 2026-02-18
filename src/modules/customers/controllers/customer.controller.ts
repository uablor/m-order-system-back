import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerCommandService } from '../services/customer-command.service';
import { CustomerQueryService } from '../services/customer-query.service';
import { CustomerCreateDto } from '../dto/customer-create.dto';
import { CustomerUpdateDto } from '../dto/customer-update.dto';
import { CustomerListQueryDto } from '../dto/customer-list-query.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { NoCache } from '../../../common/decorators/no-cache.decorator';
import {
  ApiOkResponseBase,
  ApiCreatedResponseBase,
  ApiBadRequestBase,
  ApiUnauthorizedBase,
  ApiNotFoundBase,
} from '../../../common/swagger/swagger.decorators';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    protected readonly commandService: CustomerCommandService,
    protected readonly queryService: CustomerQueryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create customer' })
  @ApiBearerAuth('BearerAuth')
  @ApiCreatedResponseBase()
  @ApiBadRequestBase()
  @ApiUnauthorizedBase()
  async create(@Body() dto: CustomerCreateDto) {
    return this.commandService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiOkResponseBase(CustomerResponseDto)
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  @NoCache()
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.queryService.getByIdOrFail(id);
  }

  @Get()
  @ApiOperation({ summary: 'List customers with pagination (optional merchantId filter)' })
  @ApiBearerAuth('BearerAuth')
  @ApiOkResponseBase()
  @ApiUnauthorizedBase()
  @NoCache()
  async getList(@Query() query: CustomerListQueryDto) {
    return this.queryService.getList(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiOkResponseBase()
  @ApiBadRequestBase()
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CustomerUpdateDto,
  ) {
    return this.commandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiBearerAuth('BearerAuth')
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiNotFoundBase()
  @ApiUnauthorizedBase()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandService.delete(id);
  }
}
