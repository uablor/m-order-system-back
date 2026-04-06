import { EntityManager, FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { PaginatedResult, PaginationOptions } from '../interfaces/paginted.interface';
export declare abstract class BaseQueryRepository<E extends ObjectLiteral> {
    readonly repository: Repository<E>;
    constructor(repository: Repository<E>);
    protected getRepo(manager?: EntityManager): Repository<E>;
    findWithPagination(options: PaginationOptions<E>, manager: EntityManager, relations?: string[]): Promise<PaginatedResult<E>>;
    findMany(options: FindManyOptions<E>, manager?: EntityManager): Promise<E[]>;
}
