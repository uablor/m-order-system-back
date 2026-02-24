import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { UserListQueryOptions } from '../dto/user-list-query.dto';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class UserQueryRepository extends BaseQueryRepository<UserOrmEntity> {
  constructor(
    @InjectRepository(UserOrmEntity)
    repository: Repository<UserOrmEntity>,
  ) {
    super(repository);
  }

  override async findWithPagination(
    options: UserListQueryOptions,
    manager: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<UserOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity');
    if (options.isActive !== undefined && options.isActive !== null) {
      qb.andWhere('entity.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    if (options.startDate) {
      qb.andWhere('entity.createdAt >= :startDate', {
        startDate: options.startDate,
      });
    }

    if (options.endDate) {
      qb.andWhere('entity.createdAt <= :endDate', { endDate: options.endDate });
    }

    if (options.merchantId) {
      qb.andWhere('entity.merchantId = :merchantId', {
        merchantId: options.merchantId,
      });
    }

    return fetchWithPagination<UserOrmEntity>({
      qb,

      sort: options.sort,
      search: options.search
        ? { kw: options.search, field: options.searchField || 'fullName' }
        : undefined,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      manager: repo.manager,
    });
  }

  async getSummary(
    options: { merchantId?: number; isActive?: boolean; search?: string; startDate?: string; endDate?: string },
    manager: import('typeorm').EntityManager,
  ): Promise<{
    totalUsers: number;
    totalActive: number;
    totalInactive: number;
  }> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity')
      .select('COUNT(entity.id)', 'totalUsers')
      .addSelect(`SUM(CASE WHEN entity.isActive = true THEN 1 ELSE 0 END)`, 'totalActive')
      .addSelect(`SUM(CASE WHEN entity.isActive = false THEN 1 ELSE 0 END)`, 'totalInactive');

    if (options.merchantId) {
      qb.andWhere('entity.merchantId = :merchantId', { merchantId: options.merchantId });
    }
    if (options.startDate) {
      qb.andWhere('entity.createdAt >= :startDate', { startDate: options.startDate });
    }
    if (options.endDate) {
      qb.andWhere('entity.createdAt <= :endDate', { endDate: options.endDate });
    }

    const raw = await qb.getRawOne();
    return {
      totalUsers: Number(raw?.totalUsers ?? 0),
      totalActive: Number(raw?.totalActive ?? 0),
      totalInactive: Number(raw?.totalInactive ?? 0),
    };
  }
}
