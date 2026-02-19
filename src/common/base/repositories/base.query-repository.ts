import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import {
  PaginatedResult,
  PaginationOptions,
} from '../interfaces/paginted.interface';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

export abstract class BaseQueryRepository<E extends ObjectLiteral> {
  constructor(public readonly repository: Repository<E>) {}

  protected getRepo(manager?: EntityManager): Repository<E> {
    return manager
      ? manager.getRepository(this.repository.target as EntityTarget<E>)
      : this.repository;
  }

  async findWithPagination(
    options: PaginationOptions<E>,
    manager: EntityManager,
    relations?: string[],
  ): Promise<PaginatedResult<E>> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity');

    if (relations?.length) {
      relations.forEach((relation) => {
        qb.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }

    return fetchWithPagination<E>({
      qb,
      sort: options.sort,
      search: options.search
        ? { kw: options.search, field: options.searchField || 'name' }
        : undefined,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      manager: repo.manager,
    });
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
