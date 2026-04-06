import { PaginationResponse } from './paginted.interface';
export interface ResponseInterface<T> {
    success: boolean;
    Code: number;
    message: string;
    results?: T;
}
export interface ResponseWithPaginationInterface<T> extends Omit<ResponseInterface<T>, 'results'> {
    results: T[];
    pagination: PaginationResponse;
}
