import { Body, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../interfaces/paginted.interface';
import { BaseCommandService } from '../services/base-command.service';
import { BaseQueryService } from '../services/base-query.service';
import { createSingleResponse } from '../helpers/response.helper';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

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
  async getById(@Param('id', ParseIntPipe) id: number) {
    const dto = await this.queryService.getById(id);
    if (!dto) throw new NotFoundException('Resource not found');
    return createSingleResponse(dto);
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
  async delete(@Param('id') id: number, @CurrentUser() currentUser: CurrentUserPayload | undefined) {
    return this.commandService.delete(id, currentUser);
  }
}
