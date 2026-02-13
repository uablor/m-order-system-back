import { PaginationResponse } from './paginted.interface';

/** Non-paginated response: single item or simple list. */
export interface ResponseInterface<T> {
  success: boolean;
  Code: number;
  message: string;
  results?: T[];
}

/** Paginated list response: results + pagination. */
export interface ResponseWithPaginationInterface<T> extends Omit<ResponseInterface<T>, 'results'> {
  results: T[];
  pagination: PaginationResponse;
}
