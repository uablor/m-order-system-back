import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { PaginatedResult, PaginationOptions, PaginationResponse } from '../interfaces/paginted.interface';



export abstract class BaseQueryRepository<E extends ObjectLiteral> {
  constructor(public readonly repository: Repository<E>) {}

  protected getRepo(manager?: EntityManager): Repository<E> {
    return (manager ?? this.repository.manager) as unknown as Repository<E>;
  }

  async findWithPagination(
    options: PaginationOptions<E>,
    manager?: EntityManager,
  ): Promise<PaginatedResult<E>> {
    const repo = manager
      ? manager.getRepository(this.repository.target as EntityTarget<E>)
      : this.repository;
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const [data, total] = await repo.findAndCount({
      where: options.where,
      order: options.order as FindManyOptions<E>['order'],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationResponse = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      success: true,
      Code: 200,
      message: 'Data fetched successfully',
      results: data as E[],
      pagination,
    };
  }

  async findMany(
    options: FindManyOptions<E>,
    manager?: EntityManager,
  ): Promise<E[]> {
    const repo = manager
      ? manager.getRepository(this.repository.target as EntityTarget<E>)
      : this.repository;
    return repo.find(options) as Promise<E[]>;
  }
}
