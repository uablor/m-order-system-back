import { SortDirection } from '../enums/base.query.enum';
export declare class BaseQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    searchField?: string;
    sort?: SortDirection;
}
