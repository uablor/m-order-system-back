import { Injectable } from '@nestjs/common';
import type { ResponseWithPaginationInterface } from '../interfaces/response.interface';
import type { PaginationQuery } from '../interfaces/paginted.interface';

@Injectable()
export abstract class BaseQueryService<E, TListQuery = PaginationQuery> {
  abstract getById(id: number): Promise<E | null>;
  abstract getList(query: TListQuery): Promise<ResponseWithPaginationInterface<E>>;
}
