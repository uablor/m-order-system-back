
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import { SortDirection } from '../enums/base.query.enum';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationOptions<E extends ObjectLiteral> {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: SortDirection;
  where?: FindOptionsWhere<E>;
  relations?: FindManyOptions<E>['relations'];
}

export interface  PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Same shape as ResponseWithPaginationInterface<E>; use for paginated list. */
export interface PaginatedResult<E> {
  success: boolean;
  Code: number;
  message: string;
  results: E[];
  pagination: PaginationResponse;
}

export interface PaginationQueryDto extends PaginationQuery {}
