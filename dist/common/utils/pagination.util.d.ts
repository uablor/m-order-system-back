import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { ResponseWithPaginationInterface } from '../base/interfaces/response.interface';
import { SortDirection } from '../base/enums/base.query.enum';
export declare function fetchWithPagination<T extends object>(query: {
    qb: SelectQueryBuilder<T>;
    sort?: SortDirection;
    search?: {
        kw?: string;
        field: string;
    };
    page: number;
    limit: number;
    manager: EntityManager;
}): Promise<ResponseWithPaginationInterface<T>>;
