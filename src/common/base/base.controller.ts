import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BaseCommandService } from './base-command.service';
import { BaseQueryService } from './base-query.service';

export interface PaginationQueryDto {
  page?: number;
  limit?: number;
}

export abstract class BaseController<
  TCreateDto,
  TUpdateDto,
  TResponseDto,
  TListQueryDto extends PaginationQueryDto = PaginationQueryDto,
> {
  constructor(
    protected readonly commandService: BaseCommandService<TCreateDto, TUpdateDto>,
    protected readonly queryService: BaseQueryService<TResponseDto, TListQueryDto>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: TCreateDto) {
    return this.commandService.create(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.queryService.getById(id);
  }

  @Get()
  async getList(@Query() query: TListQueryDto) {
    return this.queryService.getList(query);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: TUpdateDto) {
    return this.commandService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    return this.commandService.delete(id);
  }
}
