import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class MerchantQueryRepository extends BaseQueryRepository<MerchantOrmEntity> {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    repository: Repository<MerchantOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: { page?: number; limit?: number; ownerUserId?: number; search?: string },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<MerchantOrmEntity>> {
    const where: any = {};

    if (options.ownerUserId != null) {
      where.ownerUserId = options.ownerUserId;
    }

    if (options.search?.trim()) {
      where.shopName = Like(`%${options.search.trim()}%`);
    }

    return super.findWithPagination(
      {
        page: options.page,
        limit: options.limit,
        where: Object.keys(where).length > 0 ? where : undefined,
        order: { createdAt: 'DESC' as const },
      },
      manager,
    );
  }
}
