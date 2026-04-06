import type { ResponseInterface, ResponseWithPaginationInterface } from '../interfaces/response.interface';
import type { PaginationResponse } from '../interfaces/paginted.interface';
export declare const DEFAULT_SUCCESS_CODE = 200;
export declare const DEFAULT_SUCCESS_MESSAGE = "Success";
export declare function createResponse<T>(results: T[], message?: string, Code?: number): ResponseInterface<T[]>;
export declare function createSingleResponse<T>(data: T, message?: string, Code?: number): ResponseInterface<T>;
export declare function createPaginatedResponse<T>(results: T[], pagination: PaginationResponse, message?: string, Code?: number): ResponseWithPaginationInterface<T>;
