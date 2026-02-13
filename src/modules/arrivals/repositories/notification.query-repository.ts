import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class NotificationQueryRepository extends BaseQueryRepository<NotificationOrmEntity> {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    repository: Repository<NotificationOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: {
      page?: number;
      limit?: number;
      merchantId?: number;
      customerId?: number;
      notificationType?: string;
      status?: string;
    },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<NotificationOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<NotificationOrmEntity> = {};
    if (options.merchantId != null) where.merchant = { id: options.merchantId };
    if (options.customerId != null) where.customer = { id: options.customerId };
    if (options.notificationType != null) where.notificationType = options.notificationType as any;
    if (options.status != null) where.status = options.status as any;
    const [data, total] = await repo.findAndCount({
      where: Object.keys(where).length ? where : undefined,
      relations: ['merchant', 'customer'],
      order: { createdAt: 'DESC' as const },
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
    return { results: data, pagination };
  }
}
