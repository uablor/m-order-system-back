import { Injectable } from '@nestjs/common';
import { PaginatedResult } from './base.query-repository';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

@Injectable()
export abstract class BaseQueryService<E, TListQuery = PaginationQuery> {
  abstract getById(id: number): Promise<E | null>;
  abstract getList(query: TListQuery): Promise<PaginatedResult<E>>;
}
