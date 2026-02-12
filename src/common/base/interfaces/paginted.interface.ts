import { FindManyOptions, FindOptionsWhere, ObjectLiteral } from "typeorm";

export interface PaginationQuery {
    page?: number;
    limit?: number;
  }

  export interface PaginationOptions<E extends ObjectLiteral> {
    page?: number;
    limit?: number;
    where?: FindOptionsWhere<E>;
    order?: FindManyOptions<E>['order'];
  }
  
  export interface PaginationResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export interface PaginatedResult<E> {
    results: E[];
    pagination: PaginationResponse;
  }

  
export interface PaginationQueryDto extends PaginationQuery {
  }
  