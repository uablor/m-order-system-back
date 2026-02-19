import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import {
  MerchantListOptionsQueryDto,
  MerchantListQueryDto,
} from '../dto/merchant-list-query.dto';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class MerchantQueryRepository extends BaseQueryRepository<MerchantOrmEntity> {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    repository: Repository<MerchantOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: MerchantListOptionsQueryDto,
    manager: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<MerchantOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity');

    if (options.ownerUserId != null) {
      qb.andWhere('entity.ownerUserId = :ownerUserId', {
        ownerUserId: options.ownerUserId,
      });
    }

    return fetchWithPagination<MerchantOrmEntity>({
      qb,
      sort: options.sort,
      search: options.search?.trim()
        ? { kw: options.search.trim(), field: options.searchField || 'shopName' }
        : undefined,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      manager: repo.manager,
    });
  }

  async findMerchantDetail(
    ownerUserId: number,
    manager: import('typeorm').EntityManager,
  ): Promise<MerchantOrmEntity | null> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity');
    qb.where('entity.ownerUserId = :ownerUserId', { ownerUserId });
    qb.leftJoinAndSelect('entity.ownerUser', 'ownerUser');
    return qb.getOne();
  }
}
