import type { ResponseInterface, ResponseWithPaginationInterface } from '../interfaces/response.interface';
import type { PaginationResponse } from '../interfaces/paginted.interface';

export const DEFAULT_SUCCESS_CODE = 200;
export const DEFAULT_SUCCESS_MESSAGE = 'Success';

export function createResponse<T>(
  results: T[],
  message = DEFAULT_SUCCESS_MESSAGE,
  Code = DEFAULT_SUCCESS_CODE,
): ResponseInterface<T> {
  return { success: true, Code, message, results };
}

export function createSingleResponse<T>(
  data: T,
  message = DEFAULT_SUCCESS_MESSAGE,
  Code = DEFAULT_SUCCESS_CODE,
): ResponseInterface<T> {
  return { success: true, Code, message, results: [data] };
}

export function createPaginatedResponse<T>(
  results: T[],
  pagination: PaginationResponse,
  message = DEFAULT_SUCCESS_MESSAGE,
  Code = DEFAULT_SUCCESS_CODE,
): ResponseWithPaginationInterface<T> {
  return { success: true, Code, message, results, pagination };
}
